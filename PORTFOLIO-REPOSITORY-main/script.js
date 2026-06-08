/* =============================================
   VIRENDRA BAGUL — PORTFOLIO JAVASCRIPT
   Handles: Preloader, Navbar, Particles,
            Typed.js, Counters, Skill Bars,
            Contact Form, Scroll effects, AOS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------
       PRELOADER
    ------------------------------------------ */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
        }, 1000);
    });

    /* ------------------------------------------
       AOS ANIMATION INIT
    ------------------------------------------ */
    AOS.init({
        once: true,
        duration: 700,
        offset: 80,
        easing: 'ease-out-cubic'
    });

    /* ------------------------------------------
       DOWNLOAD CV — Open PDF in new tab
    ------------------------------------------ */
    const downloadCvBtn = document.getElementById('downloadCvBtn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('resume.pdf', '_blank');
        });
    }

    /* ------------------------------------------
       NAVBAR — SCROLL & ACTIVE LINK
    ------------------------------------------ */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
        // Sticky
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Scroll-up button
        const scrollBtn = document.getElementById('scrollUpBtn');
        if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 500);

        // Active nav link
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ------------------------------------------
       HAMBURGER MENU
    ------------------------------------------ */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close on nav link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            hamburger.classList.remove('open');
            navMenu.classList.remove('open');
        }
    });

    /* ------------------------------------------
       SCROLL UP BUTTON
    ------------------------------------------ */
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------
       TYPED.JS — Hero & About
    ------------------------------------------ */
    if (typeof Typed !== 'undefined') {
        new Typed('#typingText', {
            strings: [
                'DevOps Engineer',
                'AWS Cloud Engineer',
                'Linux Administrator',
                'Infrastructure Specialist',
                'SRE Enthusiast'
            ],
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 2000,
            loop: true,
            smartBackspace: true
        });

        new Typed('.typing-about', {
            strings: [
                'DevOps Engineer.',
                'Linux Administrator.',
                'AWS Cloud Engineer.',
                'continuous learner.'
            ],
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 1800,
            loop: true
        });
    }

    /* ------------------------------------------
       ANIMATED COUNTER — About Stats
    ------------------------------------------ */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = 1500;
                const step = target / (duration / 16);
                let current = 0;
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current) + '+';
                    }
                }, 16);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    /* ------------------------------------------
       SKILL BARS — Animate on View
    ------------------------------------------ */
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
                skillBarObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        skillBarObserver.observe(bar);
    });

    /* ------------------------------------------
       TOAST NOTIFICATION SYSTEM
    ------------------------------------------ */
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info', duration = 4000) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            copy: 'fas fa-clipboard-check'
        };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="${icons[type] || icons.info} toast-icon"></i>
            <span class="toast-msg">${message}</span>
            <div class="toast-progress"></div>`;
        toast.addEventListener('click', () => dismissToast(toast));
        toastContainer.appendChild(toast);

        const timer = setTimeout(() => dismissToast(toast), duration);
        toast._timer = timer;
    }

    function dismissToast(toast) {
        clearTimeout(toast._timer);
        toast.style.animation = 'toastOut 0.3s ease forwards';
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }

    /* ------------------------------------------
       COPY TO CLIPBOARD — Contact Info Cards
    ------------------------------------------ */
    document.querySelectorAll('.contact-item.copyable').forEach(item => {
        item.addEventListener('click', async () => {
            const text = item.getAttribute('data-copy');
            try {
                await navigator.clipboard.writeText(text);
                item.classList.add('copied');
                showToast(`Copied: <strong>${text}</strong>`, 'copy', 3000);
                setTimeout(() => item.classList.remove('copied'), 2000);
            } catch {
                // Fallback for non-HTTPS or older browsers
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                item.classList.add('copied');
                showToast(`Copied: <strong>${text}</strong>`, 'copy', 3000);
                setTimeout(() => item.classList.remove('copied'), 2000);
            }
        });
    });

    /* ------------------------------------------
       CONTACT FORM — Full Validation & Submit
    ------------------------------------------ */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const charCounter = document.getElementById('charCounter');
        const msgField = document.getElementById('cnt-msg');
        const nameField = document.getElementById('cnt-name');
        const emailField = document.getElementById('cnt-email');

        // ── Real-time Character Counter ──
        if (msgField && charCounter) {
            msgField.addEventListener('input', () => {
                const len = msgField.value.length;
                const max = parseInt(msgField.getAttribute('maxlength')) || 1000;
                charCounter.textContent = `${len} / ${max}`;
                charCounter.classList.toggle('warn', len > max * 0.8);
                charCounter.classList.toggle('danger', len > max * 0.95);
            });
        }

        // ── Live Validation Helpers ──
        function setFieldState(group, valid, errorId, msg) {
            const el = document.getElementById(group);
            if (!el) return;
            el.classList.toggle('valid', valid);
            el.classList.toggle('invalid', !valid);
            const err = document.getElementById(errorId);
            if (err) err.textContent = valid ? '' : msg;
        }

        function validateName() {
            const v = nameField.value.trim();
            const ok = v.length >= 2;
            setFieldState('nameGroup', ok, 'nameError', 'Please enter your full name (min 2 chars).');
            return ok;
        }

        function validateEmail() {
            const v = emailField.value.trim();
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            setFieldState('emailGroup', ok, 'emailError', 'Please enter a valid email address.');
            return ok;
        }

        function validateMsg() {
            const v = msgField.value.trim();
            const ok = v.length >= 10;
            setFieldState('msgGroup', ok, 'msgError', 'Message must be at least 10 characters.');
            return ok;
        }

        // Attach live blur validation
        nameField && nameField.addEventListener('blur', validateName);
        emailField && emailField.addEventListener('blur', validateEmail);
        msgField && msgField.addEventListener('blur', validateMsg);

        // ── Form Submit ──
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check
            const honey = contactForm.querySelector('input[name="_honey"]');
            if (honey && honey.value) return;

            const okName = validateName();
            const okEmail = validateEmail();
            const okMsg = validateMsg();

            if (!okName || !okEmail || !okMsg) {
                shakeEl(contactForm.querySelector('.invalid') || contactForm);
                showToast('Please fix the highlighted fields.', 'error', 4000);
                return;
            }

            // Show loading
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;

            const name = nameField.value.trim();
            const email = emailField.value.trim();
            const subject = (document.getElementById('cnt-subject')?.value || 'Portfolio Contact').trim();
            const message = msgField.value.trim();

            try {
                /* ── EmailJS send (free, no server needed) ──
                   Sign up at emailjs.com, create a service + template,
                   then replace the three IDs below:
                   - YOUR_SERVICE_ID   → e.g. "service_abc123"
                   - YOUR_TEMPLATE_ID  → e.g. "template_xyz789"
                   - YOUR_PUBLIC_KEY   → e.g. "AbCdEfGhIjKlMnOp"
                ----------------------------------------- */
                if (typeof emailjs !== 'undefined') {
                    await emailjs.send(
                        'YOUR_SERVICE_ID',
                        'YOUR_TEMPLATE_ID',
                        { from_name: name, from_email: email, subject, message },
                        'YOUR_PUBLIC_KEY'
                    );
                    contactForm.reset();
                    resetAllFieldStates();
                    if (charCounter) charCounter.textContent = '0 / 1000';
                    showToast('🎉 Message sent! I\'ll get back to you soon.', 'success', 6000);
                } else {
                    throw new Error('emailjs-not-loaded');
                }
            } catch (err) {
                // Graceful fallback → open native email client
                const subjectEnc = encodeURIComponent(subject);
                const bodyEnc = encodeURIComponent(
                    `Hi Virendra,\n\nMy name is ${name}.\n\n${message}\n\nBest,\n${name}\n${email}`
                );
                window.location.href = `mailto:virendrabagul7@gmail.com?subject=${subjectEnc}&body=${bodyEnc}`;
                showToast('Opening your email client…', 'info', 4000);
            } finally {
                btnText.style.display = 'inline-flex';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });

        function resetAllFieldStates() {
            ['nameGroup', 'emailGroup', 'subjectGroup', 'msgGroup'].forEach(id => {
                const el = document.getElementById(id);
                if (el) { el.classList.remove('valid', 'invalid'); }
            });
            ['nameError', 'emailError', 'msgError'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '';
            });
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function shakeEl(el) {
        el.style.animation = 'shake 0.4s ease';
        el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
    }

    function shakeForm(el) { shakeEl(el); }

    /* ------------------------------------------
       SMOOTH SCROLL — All Anchor Links
    ------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ------------------------------------------
       PARTICLES CANVAS
    ------------------------------------------ */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize, { passive: true });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.5 + 0.3;
                this.speedX = (Math.random() - 0.5) * 0.35;
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.alpha = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '124,58,237' : '236,72,153';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
                ctx.fill();
            }
        }

        // Init particles
        const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 20));
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        // Connect close particles
        const connectParticles = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const alpha = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            connectParticles();
            animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    /* ------------------------------------------
       FOOTER YEAR
    ------------------------------------------ */
    
    /* ------------------------------------------
       INTERACTIVE DEVOPS TERMINAL SIMULATOR
    ------------------------------------------ */
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalBody = document.getElementById('terminalBody');

    if (terminalInput && terminalOutput) {
        // Scroll terminal to bottom on start
        terminalBody.scrollTop = terminalBody.scrollHeight;

        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandText = terminalInput.value.trim();
                terminalInput.value = '';
                
                // Add prompt and command to output
                const userCommandLine = document.createElement('div');
                userCommandLine.className = 'terminal-input-line-echo';
                userCommandLine.innerHTML = `<span class="term-prompt">viren@infrastructure:~$</span> <span class="term-echoed">${escapeHTML(commandText)}</span>`;
                terminalOutput.appendChild(userCommandLine);
                
                // Process command
                if (commandText) {
                    processCommand(commandText.toLowerCase());
                } else {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                }
            }
        });

        // Click anywhere in terminal body to focus input
        terminalBody.addEventListener('click', () => {
            terminalInput.focus();
        });

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, 
                tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
            );
        }

        async function processCommand(cmd) {
            const outputDiv = document.createElement('div');
            outputDiv.className = 'command-response';
            outputDiv.style.marginTop = '4px';
            outputDiv.style.marginBottom = '6px';
            
            switch (cmd) {
                case 'help':
                    outputDiv.innerHTML = `
                        <div class="term-green" style="font-weight:600;">Available DevOps Commands:</div>
                        <div style="margin-left: 15px; margin-top: 4px; display: grid; grid-template-columns: 140px 1fr; gap: 4px; font-family: Courier New, monospace; font-size: 0.85rem;">
                            <div><span class="term-cyan">about</span></div><div>Display Viren's bio & summary</div>
                            <div><span class="term-cyan">skills</span></div><div>List technical skills inventory</div>
                            <div><span class="term-cyan">projects</span></div><div>Show key automation & cloud projects</div>
                            <div><span class="term-cyan">ansible-run</span></div><div>Run simulated Ansible server playbook</div>
                            <div><span class="term-cyan">terraform-plan</span></div><div>Simulate Terraform EBS provisioning</div>
                            <div><span class="term-cyan">clear</span></div><div>Clear screen console</div>
                            <div><span class="term-cyan">help</span></div><div>Print this menu options</div>
                        </div>
                    `;
                    break;
                case 'about':
                    outputDiv.innerHTML = `
                        <div class="term-yellow" style="font-weight:600; margin-bottom:4px;">Viren Bagul - DevOps & AWS Cloud Engineer</div>
                        <div class="term-gray" style="line-height: 1.5; font-size: 0.85rem;">
                            I am a passionate IT graduate focused on DevOps, Cloud Computing, and Linux Administration. 
                            I design, automate, and orchestrate server deployments using Terraform, Ansible, AWS infrastructure, and Docker.
                            Currently seeking SRE, Cloud, and Infrastructure engineering roles where I can drive automation.
                        </div>
                    `;
                    break;
                case 'skills':
                    outputDiv.innerHTML = `
                        <div class="term-yellow" style="font-weight:600; margin-bottom:4px;">Skills Inventory:</div>
                        <div style="margin-left: 15px; font-family: Courier New, monospace; font-size: 0.85rem; line-height: 1.5;">
                            <div><span class="term-cyan">[Cloud Platform]</span> AWS EC2, S3, IAM, VPC, CloudWatch, EBS, Backups</div>
                            <div><span class="term-cyan">[DevOps & CI/CD]</span> Docker, Kubernetes, Terraform, Ansible, Jenkins, Git/GitHub</div>
                            <div><span class="term-cyan">[Operating Sys]</span> Linux (Ubuntu, Amazon Linux, Red Hat Enterprise, CentOS)</div>
                            <div><span class="term-cyan">[Infrastructure]</span> System Admin, Network Fundamentals, SSH, DNS, Security Groups</div>
                            <div><span class="term-cyan">[Programming  ]</span> Python, Shell Scripting, Bash, C / C++</div>
                        </div>
                    `;
                    break;
                case 'projects':
                    outputDiv.innerHTML = `
                        <div class="term-yellow" style="font-weight:600; margin-bottom:4px;">DevOps & Infrastructure Projects:</div>
                        <div style="margin-left: 15px; font-family: Courier New, monospace; font-size: 0.85rem; line-height: 1.5;">
                            <div>1. <span class="term-cyan">AWS EBS Backup & Disaster Recovery</span> - EBS backup snapshots & restore logic.</div>
                            <div>2. <span class="term-cyan">Ansible User Management Role</span> - Automated SSH/IAM role accounts setup.</div>
                            <div>3. <span class="term-cyan">NeuroAid Assistant</span> - AI healthcare cognitive engine container deployment.</div>
                            <div>4. <span class="term-cyan">TalentFlow Dashboard</span> - Candidate recruiter workflow tracking platform.</div>
                        </div>
                        <div class="term-gray" style="font-size: 0.78rem; margin-top: 6px; font-style: italic;">💡 Run 'ansible-run' or 'terraform-plan' to see automation playbooks!</div>
                    `;
                    break;
                case 'ansible-run':
                    terminalInput.disabled = true;
                    outputDiv.innerHTML = `<span class="term-yellow">Executing playbook: user-management-deploy.yml...</span>`;
                    terminalOutput.appendChild(outputDiv);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    
                    await sleep(800);
                    printAnsibleLine("PLAY [Automated Linux Server User Orchestration] **********************", "term-white");
                    await sleep(1000);
                    printAnsibleLine("TASK [Gathering Facts] *************************************************", "term-white");
                    printAnsibleLine("ok: [aws-ec2-linux-1]", "term-green");
                    await sleep(800);
                    printAnsibleLine("TASK [Ensure groups exist (devops, operations)] ************************", "term-white");
                    printAnsibleLine("changed: [aws-ec2-linux-1] => (item=devops)  [status: group_created]", "term-yellow");
                    printAnsibleLine("changed: [aws-ec2-linux-1] => (item=operations) [status: group_created]", "term-yellow");
                    await sleep(1000);
                    printAnsibleLine("TASK [Create user accounts & configure SSH keys] ***********************", "term-white");
                    printAnsibleLine("changed: [aws-ec2-linux-1] => (item=viren)   [added SSH key authorized_keys]", "term-yellow");
                    printAnsibleLine("changed: [aws-ec2-linux-1] => (item=recruiter) [added SSH key authorized_keys]", "term-yellow");
                    await sleep(800);
                    printAnsibleLine("TASK [Configure secure passwordless sudo for devops group] *************", "term-white");
                    printAnsibleLine("changed: [aws-ec2-linux-1] => [added /etc/sudoers.d/devops config]", "term-yellow");
                    await sleep(600);
                    printAnsibleLine("PLAY RECAP *************************************************************", "term-white");
                    printAnsibleLine("aws-ec2-linux-1            : ok=4    changed=3    unreachable=0    failed=0", "term-green");
                    
                    terminalInput.disabled = false;
                    terminalInput.focus();
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    return;
                case 'terraform-plan':
                    terminalInput.disabled = true;
                    outputDiv.innerHTML = `<span class="term-yellow">Initializing Terraform plan...</span>`;
                    terminalOutput.appendChild(outputDiv);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    
                    await sleep(800);
                    printTerraformLine("var.aws_region: us-east-1", "term-gray");
                    printTerraformLine("Refreshing Terraform state in-memory...", "term-gray");
                    await sleep(1000);
                    printTerraformLine("Terraform will perform the following actions:", "term-white");
                    printTerraformLine("  # aws_ebs_volume.backup_vol will be created", "term-white");
                    printTerraformLine("  + resource \"aws_ebs_volume\" \"backup_vol\" {", "term-green");
                    printTerraformLine("      + availability_zone = \"us-east-1a\"", "term-green");
                    printTerraformLine("      + size              = 20", "term-green");
                    printTerraformLine("      + encrypted         = true", "term-green");
                    printTerraformLine("      + tags              = {", "term-green");
                    printTerraformLine("          + \"Name\"        = \"Viren-DR-Volume\"", "term-green");
                    printTerraformLine("          + \"Environment\" = \"Production\"", "term-green");
                    printTerraformLine("        }", "term-green");
                    printTerraformLine("    }", "term-green");
                    printTerraformLine("  # aws_volume_attachment.ebs_att will be created", "term-white");
                    printTerraformLine("  + resource \"aws_volume_attachment\" \"ebs_att\" {", "term-green");
                    printTerraformLine("      + device_name = \"/dev/sdh\"", "term-green");
                    printTerraformLine("      + instance_id = \"i-09fca98418a993e50\"", "term-green");
                    printTerraformLine("    }", "term-green");
                    await sleep(1000);
                    printTerraformLine("Plan: 2 to add, 0 to change, 0 to destroy.", "term-green");
                    
                    terminalInput.disabled = false;
                    terminalInput.focus();
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    return;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    return;
                default:
                    outputDiv.innerHTML = `<span class="term-red">bash: command not found: ${escapeHTML(cmd)}. Type 'help' for options.</span>`;
            }
            
            terminalOutput.appendChild(outputDiv);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function printAnsibleLine(text, cssClass) {
            const line = document.createElement('div');
            line.className = cssClass;
            line.style.fontFamily = 'Courier New, monospace';
            line.style.fontSize = '0.82rem';
            line.style.marginTop = '2px';
            line.textContent = text;
            terminalOutput.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function printTerraformLine(text, cssClass) {
            const line = document.createElement('div');
            line.className = cssClass;
            line.style.fontFamily = 'Courier New, monospace';
            line.style.fontSize = '0.82rem';
            line.style.marginTop = '2px';
            line.textContent = text;
            terminalOutput.appendChild(line);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    }

const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();

});

/* ------------------------------------------
   SHAKE ANIMATION (Injected via JS)
------------------------------------------ */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}
`;
document.head.appendChild(shakeStyle);
