from flask import Flask, render_template, request, jsonify
import re
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-123')

def vigenere_chiffrer(texte_clair, cle):
    """Chiffrer le texte en utilisant l'algorithme Vigenère Cipher"""
    texte_clair = texte_clair.upper()
    cle = cle.upper()
    
    # Supprimer les caractères non alphabétiques
    texte_clair = re.sub(r'[^A-Z]', '', texte_clair)
    cle = re.sub(r'[^A-Z]', '', cle)
    
    if not cle:
        return "Veuillez entrer une clé valide"
    
    if not texte_clair:
        return "Veuillez entrer un texte à chiffrer"
    
    texte_chiffre = ""
    index_cle = 0
    
    for caractere in texte_clair:
        if caractere.isalpha():
            decalage = ord(cle[index_cle % len(cle)]) - ord('A')
            caractere_chiffre = chr((ord(caractere) - ord('A') + decalage) % 26 + ord('A'))
            texte_chiffre += caractere_chiffre
            index_cle += 1
    
    return texte_chiffre

def vigenere_dechiffrer(texte_chiffre, cle):
    """Déchiffrer le texte en utilisant l'algorithme Vigenère Cipher"""
    texte_chiffre = texte_chiffre.upper()
    cle = cle.upper()
    
    # Supprimer les caractères non alphabétiques
    texte_chiffre = re.sub(r'[^A-Z]', '', texte_chiffre)
    cle = re.sub(r'[^A-Z]', '', cle)
    
    if not cle:
        return "Veuillez entrer une clé valide"
    
    if not texte_chiffre:
        return "Veuillez entrer un texte à déchiffrer"
    
    texte_dechiffre = ""
    index_cle = 0
    
    for caractere in texte_chiffre:
        if caractere.isalpha():
            decalage = ord(cle[index_cle % len(cle)]) - ord('A')
            caractere_dechiffre = chr((ord(caractere) - ord('A') - decalage) % 26 + ord('A'))
            texte_dechiffre += caractere_dechiffre
            index_cle += 1
    
    return texte_dechiffre

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chiffrer', methods=['POST'])
def chiffrer():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'erreur': 'Aucune donnée fournie'})
        
        texte_clair = data.get('texte', '')
        cle = data.get('cle', '')
        
        if not texte_clair:
            return jsonify({'erreur': 'Veuillez saisir le texte à chiffrer'})
        
        if not cle:
            return jsonify({'erreur': 'Veuillez saisir la clé de chiffrement'})
        
        texte_chiffre = vigenere_chiffrer(texte_clair, cle)
        return jsonify({'resultat': texte_chiffre})
    
    except Exception as e:
        return jsonify({'erreur': f'Erreur serveur: {str(e)}'})

@app.route('/dechiffrer', methods=['POST'])
def dechiffrer():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'erreur': 'Aucune donnée fournie'})
        
        texte_chiffre = data.get('texte', '')
        cle = data.get('cle', '')
        
        if not texte_chiffre:
            return jsonify({'erreur': 'Veuillez saisir le texte à déchiffrer'})
        
        if not cle:
            return jsonify({'erreur': 'Veuillez saisir la clé de déchiffrement'})
        
        texte_dechiffre = vigenere_dechiffrer(texte_chiffre, cle)
        return jsonify({'resultat': texte_dechiffre})
    
    except Exception as e:
        return jsonify({'erreur': f'Erreur serveur: {str(e)}'})

@app.route('/sante')
def sante():
    return jsonify({'statut': 'en bonne santé'})

@app.route('/apropos')
def apropos():
    return jsonify({
        'application': 'Chiffrement Vigenère',
        'version': '1.0',
        'description': 'Application web de chiffrement et déchiffrement utilisant le chiffre de Vigenère',
        'auteur': 'Votre Nom',
        'langue': 'français'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)