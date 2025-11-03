// Common passwords list (sample from rockyou.txt)
const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
    'ashley', 'bailey', 'passw0rd', 'shadow', '123123', '654321', 'superman',
    'qazwsx', 'michael', 'football', 'welcome', 'jesus', 'ninja', 'mustang',
    'password1', '123456789', '12345', 'princess', 'starwars', 'password123',
    'charlie', 'admin', 'hello', 'freedom', 'whatever', 'qwertyuiop', 'trustno1',
    'jordan', 'hunter', 'buster', 'soccer', 'harley', 'batman', 'andrew', 'tigger',
    'robert', 'ranger', 'daniel', 'thomas', 'asshole', 'fuckyou', 'fuckme', 'killer',
    'hockey', 'george', 'butter', 'cheese', 'money', 'cowboy', 'samsung', 'bailey'
];

// DOM Elements
const passwordInput = document.getElementById('passwordInput');
const togglePassword = document.getElementById('togglePassword');
const copyPassword = document.getElementById('copyPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const charCount = document.getElementById('charCount');
const criteriaCount = document.getElementById('criteriaCount');
const timeEstimate = document.getElementById('timeEstimate');
const results = document.getElementById('results');
const resultsText = document.getElementById('resultsText');
const generateBtn = document.getElementById('generateBtn');
const checkBtn = document.getElementById('checkBtn');

// Requirement elements
const reqLength = document.getElementById('req-length');
const reqUppercase = document.getElementById('req-uppercase');
const reqLowercase = document.getElementById('req-lowercase');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');
const reqCommon = document.getElementById('req-common');

// Password validation checks
function validatePassword(password) {
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        notCommon: !commonPasswords.includes(password.toLowerCase())
    };
    
    return checks;
}

// Update requirement UI
function updateRequirement(element, met) {
    element.classList.remove('met', 'failed');
    if (met) {
        element.classList.add('met');
    } else {
        element.classList.add('failed');
    }
}

// Calculate password strength
function calculateStrength(checks) {
    const criteriasMet = Object.values(checks).filter(Boolean).length;
    
    if (criteriasMet <= 2) return { level: 'weak', text: 'Weak', class: 'strength-weak', score: criteriasMet };
    if (criteriasMet === 3) return { level: 'medium', text: 'Medium', class: 'strength-medium', score: criteriasMet };
    if (criteriasMet === 4) return { level: 'strong', text: 'Strong', class: 'strength-strong', score: criteriasMet };
    return { level: 'very-strong', text: 'Very Strong', class: 'strength-very-strong', score: criteriasMet };
}

// Estimate crack time
function estimateCrackTime(password) {
    const charset = {
        lowercase: 26,
        uppercase: 26,
        numbers: 10,
        special: 32
    };
    
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += charset.lowercase;
    if (/[A-Z]/.test(password)) charsetSize += charset.uppercase;
    if (/[0-9]/.test(password)) charsetSize += charset.numbers;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charsetSize += charset.special;
    
    const combinations = Math.pow(charsetSize, password.length);
    const guessesPerSecond = 1000000000; // 1 billion guesses per second
    const seconds = combinations / guessesPerSecond;
    
    if (seconds < 1) return '< 1s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)}d`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)}y`;
    return `${Math.round(seconds / 31536000)}y`;
}

// Generate security analysis
function generateAnalysis(password, checks, strength) {
    const issues = [];
    const suggestions = [];
    
    if (!checks.length) issues.push('Password is too short (minimum 8 characters)');
    if (!checks.uppercase) issues.push('Missing uppercase letters');
    if (!checks.lowercase) issues.push('Missing lowercase letters');
    if (!checks.number) issues.push('Missing numbers');
    if (!checks.special) issues.push('Missing special characters');
    if (!checks.notCommon) issues.push('This is a commonly used password');
    
    if (issues.length > 0) {
        suggestions.push('Consider adding ' + issues.slice(0, 2).join(' and '));
        suggestions.push('Use a mix of characters for better security');
    }
    
    if (strength.level === 'very-strong') {
        return 'Excellent! Your password is very strong and meets all security requirements.';
    } else if (strength.level === 'strong') {
        return `Good password! To make it even stronger: ${suggestions.join('. ')}.`;
    } else if (strength.level === 'medium') {
        return `Your password is moderate. Issues found: ${issues.join(', ')}. ${suggestions.join('. ')}.`;
    } else {
        return `Weak password! Critical issues: ${issues.join(', ')}. Please create a stronger password.`;
    }
}

// Update password strength UI
function updatePasswordStrength() {
    const password = passwordInput.value;
    
    if (password === '') {
        // Reset UI
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Enter password to check strength';
        strengthText.style.color = 'rgba(255, 255, 255, 0.6)';
        charCount.textContent = '0';
        criteriaCount.textContent = '0/6';
        timeEstimate.textContent = '< 1s';
        results.style.display = 'none';
        
        // Reset all requirements
        [reqLength, reqUppercase, reqLowercase, reqNumber, reqSpecial, reqCommon].forEach(el => {
            el.classList.remove('met', 'failed');
        });
        
        return;
    }
    
    // Validate password
    const checks = validatePassword(password);
    const strength = calculateStrength(checks);
    
    // Update character count
    charCount.textContent = password.length;
    
    // Update criteria count
    criteriaCount.textContent = `${strength.score}/6`;
    
    // Update crack time estimate
    timeEstimate.textContent = estimateCrackTime(password);
    
    // Update strength bar
    strengthBar.className = `strength-bar ${strength.class}`;
    
    // Update strength text
    strengthText.textContent = strength.text;
    const colors = {
        'weak': '#ff4444',
        'medium': '#ffa500',
        'strong': '#ffeb3b',
        'very-strong': '#4ade80'
    };
    strengthText.style.color = colors[strength.level];
    
    // Update requirements
    updateRequirement(reqLength, checks.length);
    updateRequirement(reqUppercase, checks.uppercase);
    updateRequirement(reqLowercase, checks.lowercase);
    updateRequirement(reqNumber, checks.number);
    updateRequirement(reqSpecial, checks.special);
    updateRequirement(reqCommon, checks.notCommon);
}

// Generate strong password
function generateStrongPassword() {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + special;
    let password = '';
    
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < 16; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
}

// Event Listeners
passwordInput.addEventListener('input', updatePasswordStrength);

togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

copyPassword.addEventListener('click', async () => {
    const password = passwordInput.value;
    if (password) {
        try {
            await navigator.clipboard.writeText(password);
            const icon = copyPassword.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            
            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
});

generateBtn.addEventListener('click', () => {
    const newPassword = generateStrongPassword();
    passwordInput.value = newPassword;
    passwordInput.type = 'text';
    
    const toggleIcon = togglePassword.querySelector('i');
    toggleIcon.classList.remove('fa-eye');
    toggleIcon.classList.add('fa-eye-slash');
    
    updatePasswordStrength();
    
    // Show results
    results.style.display = 'block';
    resultsText.textContent = 'Strong password generated! This password meets all security requirements and is highly resistant to cracking attempts.';
});

checkBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    if (password) {
        const checks = validatePassword(password);
        const strength = calculateStrength(checks);
        const analysis = generateAnalysis(password, checks, strength);
        
        results.style.display = 'block';
        resultsText.textContent = analysis;
    } else {
        results.style.display = 'block';
        resultsText.textContent = 'Please enter a password to analyze.';
    }
});

// Initialize
updatePasswordStrength();
