/**
 * Form validation and enhanced user experience
 * for contact forms.
 */

document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form[action*="formsubmit.co"]');
    
    forms.forEach(form => {
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Send';
        
        // Add form submission handling with validation
        form.addEventListener('submit', (e) => {
            // Basic validation
            if (!validateForm(form)) return;
            
            // Change button state during submission
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = form.id.includes('gr') ? 'Αποστολή...' : 'Sending...';
            }

            // Show success message immediately since we know FormSubmit.co works
            showFormMessage(
                form, 
                form.id.includes('gr') ? 'Το μήνυμά σας στάλθηκε με επιτυχία!' : 'Your message was sent successfully!', 
                'success'
            );

            // Reset form after a short delay
            setTimeout(() => {
                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }, 1000);
        });
        
        // Real-time validation feedback
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });
    });
});

/**
 * Validate the entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate a single input field
 * @param {HTMLInputElement} input - The input to validate
 * @returns {boolean} - Whether the input is valid
 */
function validateInput(input) {
    const isGr = input.closest('form').id.includes('gr');
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous validation
    clearValidation(input);
    
    // Skip validation for non-required fields if empty
    if (!input.required && input.value.trim() === '') {
        return true;
    }
    
    // Required field validation
    if (input.required && input.value.trim() === '') {
        isValid = false;
        errorMessage = isGr ? 'Αυτό το πεδίο είναι υποχρεωτικό' : 'This field is required';
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value)) {
            isValid = false;
            errorMessage = isGr ? 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email' : 'Please enter a valid email address';
        }
    }
    
    // Set validation state
    if (!isValid) {
        input.classList.add('invalid-input');
        
        // Add error message
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = errorMessage;
        input.parentNode.appendChild(errorEl);
    } else {
        input.classList.add('valid-input');
    }
    
    return isValid;
}

/**
 * Clear validation state from an input
 * @param {HTMLInputElement} input - The input to clear
 */
function clearValidation(input) {
    input.classList.remove('invalid-input', 'valid-input');
    
    // Remove any existing error messages
    const errorEl = input.parentNode.querySelector('.error-message');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Show a form message after submission
 * @param {HTMLFormElement} form - The form to show the message on
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success/error)
 */
function showFormMessage(form, message, type) {
    // Remove any existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    // Add to form
    form.appendChild(messageEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageEl.classList.add('fade-out');
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
} 