import os
import uuid
from flask import Blueprint, jsonify, request, send_file, current_app
from werkzeug.utils import secure_filename
from datetime import datetime

files_bp = Blueprint('files', __name__)

# Configurações de upload
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx', 'zip', 'rar', 'mp3', 'mp4', 'avi'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Criar pasta de uploads se não existir
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_size(file_path):
    """Retorna o tamanho do arquivo em bytes"""
    return os.path.getsize(file_path)

def format_file_size(size_bytes):
    """Formata o tamanho do arquivo para exibição"""
    if size_bytes == 0:
        return "0B"
    size_names = ["B", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    return f"{size_bytes:.1f}{size_names[i]}"

@files_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload de arquivos"""
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
    
    if file and allowed_file(file.filename):
        # Gerar nome único para o arquivo
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        try:
            file.save(file_path)
            
            # Obter informações do arquivo
            file_size = get_file_size(file_path)
            
            file_info = {
                'id': unique_filename,
                'original_name': original_filename,
                'filename': unique_filename,
                'size': file_size,
                'size_formatted': format_file_size(file_size),
                'upload_date': datetime.now().isoformat(),
                'type': file_extension
            }
            
            return jsonify({
                'message': 'Arquivo enviado com sucesso',
                'file': file_info
            }), 201
            
        except Exception as e:
            return jsonify({'error': f'Erro ao salvar arquivo: {str(e)}'}), 500
    
    return jsonify({'error': 'Tipo de arquivo não permitido'}), 400

@files_bp.route('/files', methods=['GET'])
def list_files():
    """Lista todos os arquivos disponíveis"""
    try:
        files = []
        
        for filename in os.listdir(UPLOAD_FOLDER):
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            
            if os.path.isfile(file_path):
                file_size = get_file_size(file_path)
                file_extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                
                # Obter data de modificação
                modification_time = os.path.getmtime(file_path)
                modification_date = datetime.fromtimestamp(modification_time).isoformat()
                
                file_info = {
                    'id': filename,
                    'filename': filename,
                    'size': file_size,
                    'size_formatted': format_file_size(file_size),
                    'upload_date': modification_date,
                    'type': file_extension
                }
                
                files.append(file_info)
        
        # Ordenar por data de upload (mais recente primeiro)
        files.sort(key=lambda x: x['upload_date'], reverse=True)
        
        return jsonify({'files': files}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao listar arquivos: {str(e)}'}), 500

@files_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download de arquivo"""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Arquivo não encontrado'}), 404
        
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'error': f'Erro ao baixar arquivo: {str(e)}'}), 500

@files_bp.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    """Exclusão de arquivo"""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Arquivo não encontrado'}), 404
        
        os.remove(file_path)
        
        return jsonify({'message': 'Arquivo excluído com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao excluir arquivo: {str(e)}'}), 500

@files_bp.route('/info/<filename>', methods=['GET'])
def get_file_info(filename):
    """Obter informações detalhadas de um arquivo"""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        if not os.path.exists(file_path):
            return jsonify({'error': 'Arquivo não encontrado'}), 404
        
        file_size = get_file_size(file_path)
        file_extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
        
        # Obter data de modificação
        modification_time = os.path.getmtime(file_path)
        modification_date = datetime.fromtimestamp(modification_time).isoformat()
        
        file_info = {
            'id': filename,
            'filename': filename,
            'size': file_size,
            'size_formatted': format_file_size(file_size),
            'upload_date': modification_date,
            'type': file_extension,
            'path': file_path
        }
        
        return jsonify({'file': file_info}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erro ao obter informações do arquivo: {str(e)}'}), 500

