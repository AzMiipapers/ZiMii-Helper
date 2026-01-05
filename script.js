/**
 * ZiMii Helper - Master Application Logic
 */
const app = {
    data: {
        tasks: JSON.parse(localStorage.getItem('zimii_tasks')) || [],
        username: localStorage.getItem('zimii_name') || 'Student',
        theme: localStorage.getItem('zimii_theme') || 'light',
        totalFocusTime: parseInt(localStorage.getItem('zimii_focus_time')) || 0
    },

    init: function() {
        this.applyTheme();
        this.updateDate();
        this.updateGreeting();
        this.calculateCountdown();
        this.renderTasks();
        this.updateUserDisplay();
        this.updateRank(this.data.totalFocusTime);
        this.loadPastPapers(); // பாஸ்ட் பேப்பர்களை லோட் செய்யும்
        
        // Mobile check
        if(window.innerWidth <= 900) {
            const mobileBtn = document.getElementById('mobile-toggle');
            if(mobileBtn) mobileBtn.style.display = 'flex';
        }
    },

    // --- Intro Page ---
    closeIntro: function() {
        const intro = document.getElementById('intro-page');
        if(intro) intro.style.display = 'none';
        this.requestNotificationPermission();
    },

    // --- Navigation ---
    nav: function(sectionId) {
        document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if(targetSection) targetSection.classList.add('active');
        
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            if(link.getAttribute('onclick')?.includes(sectionId)) {
                link.classList.add('active');
            }
        });

        const titles = {
            'dashboard': 'Dashboard', 'planner': 'Study Planner', 'timer': 'Focus Timer',
            'bio': 'Biology Hub', 'maths': 'Maths Hub', 'settings': 'Settings'
        };
        document.getElementById('header-title').innerText = titles[sectionId] || 'ZiMii Helper';
        document.getElementById('sidebar').classList.remove('mobile-open');
    },

    // --- Rank System ---
    updateRank: function(totalMinutes) {
        let rank = "Beginner 🎓";
        let color = "#64748b"; 

        if(totalMinutes >= 60) { rank = "Study Warrior ⚔️"; color = "#3b82f6"; }
        if(totalMinutes >= 300) { rank = "Knowledge Seeker 🧠"; color = "#8b5cf6"; }
        if(totalMinutes >= 1000) { rank = "A/L Legend 🔥"; color = "#f59e0b"; }

        const rankEl = document.getElementById('user-rank');
        if(rankEl) {
            rankEl.innerText = rank;
            rankEl.style.color = color;
        }
    },

    // --- Past Papers Loader ---
    loadPastPapers: function() {
        const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
        const containers = ['bio-papers', 'maths-papers'];

        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if(container) {
                container.innerHTML = ""; // Clear existing
                years.forEach(year => {
                    const card = document.createElement('div');
                    card.className = 'paper-card';
                    card.innerHTML = `
                        <strong>${year} Paper</strong>
                        <a href="#" onclick="alert('Downloading ${year} Paper...')">Download</a>
                    `;
                    container.appendChild(card);
                });
            }
        });
    },

    // --- Focus Music ---
    playMusic: function(type) {
        const audio = document.getElementById('focus-audio');
        const sources = {
            'lofi': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            'rain': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
        };
        if(audio && sources[type]) {
            audio.src = sources[type];
            audio.play();
            this.showToast(`Playing ${type} beats...`);
        }
    },

    stopMusic: function() {
        const audio = document.getElementById('focus-audio');
        if(audio) audio.pause();
    },

    // --- Task Logic ---
    addTask: function() {
        const input = document.getElementById('task-input');
        const val = input.value.trim();
        if(!val) return;
        this.data.tasks.push({ id: Date.now(), text: val, completed: false });
        this.saveData();
        this.renderTasks();
        input.value = "";
        this.showToast("Task added!");
    },

    toggleTask: function(id) {
        const task = this.data.tasks.find(t => t.id === id);
        if(task) {
            task.completed = !task.completed;
            this.saveData();
            this.renderTasks();
        }
    },

    deleteTask: function(id) {
        this.data.tasks = this.data.tasks.filter(t => t.id !== id);
        this.saveData();
        this.renderTasks();
    },

    renderTasks: function() {
        const list = document.getElementById('todo-list-container');
        if(!list) return;
        list.innerHTML = "";
        this.data.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <div class="task-content" onclick="app.toggleTask(${task.id})">
                    <div class="custom-checkbox">
                        ${task.completed ? '✓' : ''}
                    </div>
                    <span>${task.text}</span>
                </div>
                <button onclick="app.deleteTask(${task.id})" style="color:red; border:none; background:none; cursor:pointer;">✕</button>
            `;
            list.appendChild(li);
        });
        const dashCount = document.getElementById('dashboard-tasks');
        if(dashCount) dashCount.innerText = this.data.tasks.filter(t => !t.completed).length;
    },

    // --- Notifications ---
    requestNotificationPermission: function() {
        if ("Notification" in window) Notification.requestPermission();
    },

    sendPush: function(title, body) {
        if (Notification.permission === "granted") new Notification(title, { body });
    },

    // --- Helpers ---
    saveData: function() { localStorage.setItem('zimii_tasks', JSON.stringify(this.data.tasks)); },
    
    updateUserDisplay: function() {
        document.getElementById('sidebar-name').innerText = this.data.username;
        document.getElementById('avatar-initial').innerText = this.data.username.charAt(0).toUpperCase();
    },

    updateDate: function() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('header-date').innerText = new Date().toLocaleDateString('en-US', options);
    },

    updateGreeting: function() {
        const hour = new Date().getHours();
        let greet = hour < 12 ? "Good Morning" : (hour < 17 ? "Good Afternoon" : "Good Evening");
        document.getElementById('greeting').innerText = `${greet}, ${this.data.username}!`;
    },

    calculateCountdown: function() {
        const diff = new Date("2026-11-01").getTime() - new Date().getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('countdown-val').innerText = days > 0 ? days : "Soon";
    },

    applyTheme: function() {
        document.body.setAttribute('data-theme', this.data.theme);
        const icon = document.getElementById('theme-icon');
        if(icon) icon.className = this.data.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    },

    toggleTheme: function() {
        this.data.theme = this.data.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('zimii_theme', this.data.theme);
        this.applyTheme();
    },

    showToast: function(msg) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-msg').innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

/**
 * Timer Module - Focus logic
 */
const timer = {
    interval: null,
    seconds: 1500,
    isRunning: false,

    updateDisplay: function() {
        const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
        const s = (this.seconds % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').innerText = `${m}:${s}`;
    },

    start: function() {
        if(this.isRunning) return;
        this.isRunning = true;
        document.getElementById('start-btn').innerText = "Running...";
        
        this.interval = setInterval(() => {
            if(this.seconds > 0) {
                this.seconds--;
                this.updateDisplay();
                // ஒவ்வொரு 60 நொடிக்கும் போக்கஸ் நேரத்தைச் சேமிக்கிறோம்
                if(this.seconds % 60 === 0) {
                    app.data.totalFocusTime++;
                    localStorage.setItem('zimii_focus_time', app.data.totalFocusTime);
                    app.updateRank(app.data.totalFocusTime);
                }
            } else {
                this.stop();
                app.sendPush("Time is up!", "Take a break, hero!");
                alert("Great session!");
            }
        }, 1000);
    },

    stop: function() {
        clearInterval(this.interval);
        this.isRunning = false;
        document.getElementById('start-btn').innerText = "Start Focus";
    },

    reset: function() {
        this.stop();
        this.seconds = 1500;
        this.updateDisplay();
    }
};

// --- Initialize ---
window.addEventListener('DOMContentLoaded', () => {
    app.init();
    timer.updateDisplay();
});
