document.addEventListener('DOMContentLoaded', function() {
    // Éléments principaux
    const textInput = document.getElementById('text-input');
    const keyInput = document.getElementById('key-input');
    const encryptBtn = document.getElementById('encrypt-btn');
    const decryptBtn = document.getElementById('decrypt-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultOutput = document.getElementById('result-output');
    const copyBtn = document.getElementById('copy-result');
    const generateKeyBtn = document.getElementById('generate-key');

    // Éléments de statistiques
    const encryptedCount = document.getElementById('encrypted-count');
    const decryptedCount = document.getElementById('decrypted-count');
    const totalOperations = document.getElementById('total-operations');
    const footerEncrypted = document.getElementById('footer-encrypted');
    const footerDecrypted = document.getElementById('footer-decrypted');

    // Éléments de visualisation
    const vizOriginal = document.getElementById('viz-original');
    const vizKey = document.getElementById('viz-key');
    const vizEncrypted = document.getElementById('viz-encrypted');
    const vizSteps = document.querySelectorAll('.viz-step');

    // Éléments d'interface
    const textCount = document.getElementById('text-count');
    const keyStrength = document.getElementById('key-strength');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    const resultTime = document.getElementById('result-time');
    const resultLength = document.getElementById('result-length');
    const securityLevel = document.getElementById('security-level');

    // Toast et tabs
    const toast = document.getElementById('toast');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Variables d'état
    let stats = {
        encrypted: 0,
        decrypted: 0,
        get total() {
            return this.encrypted + this.decrypted;
        }
    };

    // Initialisation
    init();

    function init() {
        loadStats();
        updateStatsDisplay();
        setupEventListeners();
        testServerConnection();
        updateKeyStrength();
    }

    function setupEventListeners() {
        // Événements de saisie
        textInput.addEventListener('input', updateTextCount);
        keyInput.addEventListener('input', updateKeyStrength);
        textInput.addEventListener('input', updateVisualization);
        keyInput.addEventListener('input', updateVisualization);

        // Événements des boutons
        encryptBtn.addEventListener('click', handleEncrypt);
        decryptBtn.addEventListener('click', handleDecrypt);
        clearBtn.addEventListener('click', handleClear);
        copyBtn.addEventListener('click', handleCopy);
        generateKeyBtn.addEventListener('click', generateRandomKey);

        // Événements des tabs
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Raccourci clavier
        keyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleEncrypt();
            }
        });
    }

    // Gestion des statistiques
    function loadStats() {
        const saved = localStorage.getItem('vigenere-stats');
        if (saved) {
            stats = { ...stats, ...JSON.parse(saved) };
        }
    }

    function saveStats() {
        localStorage.setItem('vigenere-stats', JSON.stringify(stats));
    }

    function updateStatsDisplay() {
        encryptedCount.textContent = stats.encrypted;
        decryptedCount.textContent = stats.decrypted;
        totalOperations.textContent = stats.total;
        footerEncrypted.textContent = stats.encrypted;
        footerDecrypted.textContent = stats.decrypted;
    }

    function incrementStat(type) {
        stats[type]++;
        saveStats();
        updateStatsDisplay();
    }

    // Mise à jour de l'interface
    function updateTextCount() {
        const count = textInput.value.length;
        textCount.textContent = count;
        
        // Animation du compteur
        if (count > 0) {
            textCount.style.color = '#10b981';
            textCount.style.fontWeight = '600';
        } else {
            textCount.style.color = '';
            textCount.style.fontWeight = '';
        }
    }

    function updateKeyStrength() {
        const key = keyInput.value;
        let strength = 0;
        let text = 'Très faible';
        let color = '#ef4444';

        if (key.length >= 12 && /[A-Za-z]/.test(key) && /[0-9]/.test(key)) {
            strength = 100;
            text = 'Très forte';
            color = '#10b981';
        } else if (key.length >= 8) {
            strength = 70;
            text = 'Forte';
            color = '#10b981';
        } else if (key.length >= 5) {
            strength = 40;
            text = 'Moyenne';
            color = '#f59e0b';
        } else if (key.length >= 3) {
            strength = 20;
            text = 'Faible';
            color = '#f59e0b';
        }

        strengthFill.style.width = `${strength}%`;
        strengthFill.style.background = color;
        strengthText.textContent = `Force de la clé: ${text}`;
        strengthText.style.color = color;

        // Mise à jour du niveau de sécurité
        updateSecurityLevel(strength);
    }

    function updateSecurityLevel(strength) {
        const securityDot = securityLevel.querySelector('.security-dot');
        
        if (strength >= 70) {
            securityLevel.style.background = 'rgba(16, 185, 129, 0.1)';
            securityLevel.style.borderColor = '#10b981';
            securityDot.style.background = '#10b981';
            securityLevel.innerHTML = '<span class="security-dot"></span> Sécurité: Élevée';
        } else if (strength >= 40) {
            securityLevel.style.background = 'rgba(245, 158, 11, 0.1)';
            securityLevel.style.borderColor = '#f59e0b';
            securityDot.style.background = '#f59e0b';
            securityLevel.innerHTML = '<span class="security-dot"></span> Sécurité: Moyenne';
        } else {
            securityLevel.style.background = 'rgba(239, 68, 68, 0.1)';
            securityLevel.style.borderColor = '#ef4444';
            securityDot.style.background = '#ef4444';
            securityLevel.innerHTML = '<span class="security-dot"></span> Sécurité: Faible';
        }
    }

    // Génération de clé aléatoire
    function generateRandomKey() {
        const length = Math.floor(Math.random() * 10) + 8; // 8-17 caractères
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        
        for (let i = 0; i < length; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        keyInput.value = key;
        updateKeyStrength();
        showToast('Clé générée avec succès!', 'success');
        
        // Animation du bouton
        generateKeyBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            generateKeyBtn.style.transform = 'scale(1)';
        }, 300);
    }

    // Visualisation en temps réel
    function updateVisualization() {
        const text = textInput.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = keyInput.value.toUpperCase().replace(/[^A-Z]/g, '');
        
        vizOriginal.textContent = text || '...';
        vizKey.textContent = key || '...';
        
        if (text && key) {
            // Simulation rapide du chiffrement pour la visualisation
            let encrypted = '';
            for (let i = 0; i < Math.min(text.length, 10); i++) {
                const textChar = text[i];
                const keyChar = key[i % key.length];
                if (textChar >= 'A' && textChar <= 'Z') {
                    const shift = keyChar.charCodeAt(0) - 65;
                    const encryptedChar = String.fromCharCode(
                        ((textChar.charCodeAt(0) - 65 + shift) % 26) + 65
                    );
                    encrypted += encryptedChar;
                }
            }
            if (text.length > 10) encrypted += '...';
            vizEncrypted.textContent = encrypted || '...';
        } else {
            vizEncrypted.textContent = '...';
        }

        // Animation des étapes
        vizSteps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
            }, index * 200);
        });
    }

    // Gestion du chiffrement
    async function handleEncrypt() {
        const texte = textInput.value.trim();
        const cle = keyInput.value.trim();

        if (!validateInput(texte, cle, 'chiffrer')) return;

        await performOperation('/chiffrer', texte, cle, 'encrypted');
    }

    // Gestion du déchiffrement
    async function handleDecrypt() {
        const texte = textInput.value.trim();
        const cle = keyInput.value.trim();

        if (!validateInput(texte, cle, 'déchiffrer')) return;

        await performOperation('/dechiffrer', texte, cle, 'decrypted');
    }

    // Validation des entrées
    function validateInput(texte, cle, operation) {
        if (!texte) {
            showToast(`Veuillez saisir le texte à ${operation}`, 'error');
            textInput.focus();
            return false;
        }
        if (!cle) {
            showToast(`Veuillez saisir la clé de ${operation}`, 'error');
            keyInput.focus();
            return false;
        }
        return true;
    }

    // Opération principale
    async function performOperation(endpoint, texte, cle, statType) {
        const startTime = performance.now();
        const button = statType === 'encrypted' ? encryptBtn : decryptBtn;

        setLoadingState(true, button);

        try {
            const data = await makeRequest(endpoint, texte, cle);
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2);

            if (data.erreur) {
                showToast(data.erreur, 'error');
                resultOutput.value = '';
            } else {
                resultOutput.value = data.resultat;
                incrementStat(statType);
                showToast(
                    statType === 'encrypted' 
                        ? 'Texte chiffré avec succès!' 
                        : 'Texte déchiffré avec succès!', 
                    'success'
                );
                
                // Mise à jour des métadonnées
                updateResultMetadata(duration, data.resultat.length);
                
                // Animation de résultat
                animateResult();
            }
        } catch (error) {
            showToast('Erreur de connexion au serveur', 'error');
            console.error(`Erreur de ${statType}:`, error);
        } finally {
            setLoadingState(false, button);
        }
    }

    // États de chargement
    function setLoadingState(loading, button) {
        const otherButton = button === encryptBtn ? decryptBtn : encryptBtn;
        
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            otherButton.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            otherButton.disabled = false;
        }
    }

    // Requêtes API
    async function makeRequest(endpoint, texte, cle) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texte: texte,
                cle: cle
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP! statut: ${response.status}`);
        }

        return await response.json();
    }

    // Métadonnées du résultat
    function updateResultMetadata(duration, length) {
        resultTime.textContent = `Temps: ${duration}ms`;
        resultLength.textContent = `Longueur: ${length} caractères`;
        
        // Animation des métadonnées
        resultTime.style.opacity = '0';
        resultLength.style.opacity = '0';
        
        setTimeout(() => {
            resultTime.style.transition = 'opacity 0.3s ease';
            resultLength.style.transition = 'opacity 0.3s ease';
            resultTime.style.opacity = '1';
            resultLength.style.opacity = '1';
        }, 100);
    }

    // Animation du résultat
    function animateResult() {
        resultOutput.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resultOutput.style.transition = 'transform 0.3s ease';
            resultOutput.style.transform = 'scale(1)';
        }, 150);
    }

    // Copie du résultat
    async function handleCopy() {
        if (!resultOutput.value) {
            showToast('Aucun résultat à copier', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(resultOutput.value);
            showToast('Résultat copié dans le presse-papier!', 'success');
            
            // Animation du bouton copie
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = '#10b981';
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            showToast('Échec de la copie', 'error');
            console.error('Erreur de copie:', err);
        }
    }

    // Effacement
    function handleClear() {
        textInput.value = '';
        keyInput.value = '';
        resultOutput.value = '';
        
        updateTextCount();
        updateKeyStrength();
        updateVisualization();
        
        showToast('Tous les champs ont été effacés', 'success');
        
        // Reset des métadonnées
        resultTime.textContent = '';
        resultLength.textContent = '';
    }

    // Gestion des tabs
    function switchTab(tabName) {
        // Désactiver tous les tabs
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Activer le tab sélectionné
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`tab-${tabName}`);
        
        activeBtn.classList.add('active');
        activeContent.classList.add('active');
        
        // Animation d'entrée
        activeContent.style.animation = 'none';
        setTimeout(() => {
            activeContent.style.animation = 'fadeIn 0.5s ease-in';
        }, 10);
    }

    // Toast notifications
    function showToast(message, type = 'success') {
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Définir l'icône et la couleur selon le type
        if (type === 'success') {
            toastIcon.className = 'toast-icon fas fa-check-circle';
            toast.classList.remove('error');
            toast.classList.add('success');
        } else {
            toastIcon.className = 'toast-icon fas fa-exclamation-circle';
            toast.classList.remove('success');
            toast.classList.add('error');
        }
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Masquer après 4 secondes
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Test de connexion
    async function testServerConnection() {
        try {
            const response = await fetch('/sante');
            if (response.ok) {
                console.log('✅ Connexion au serveur établie');
                showToast('Connexion au serveur établie', 'success');
            }
        } catch (error) {
            console.warn('❌ Test de connexion au serveur échoué:', error);
            showToast('Connexion au serveur perdue', 'error');
        }
    }

    // Initialisation de la visualisation
    updateVisualization();
    
    // Animation d'entrée globale
    setTimeout(() => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Fonction utilitaire pour le débogage
function debugStats() {
    const stats = localStorage.getItem('vigenere-stats');
    console.log('📊 Statistiques:', stats ? JSON.parse(stats) : 'Aucune donnée');
}

// Export pour utilisation globale (si nécessaire)
window.VigenereApp = {
    debugStats,
    version: '2.0.0'
};