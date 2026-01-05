/**
 * ZiMii Helper Core Application Logic
 */
const app = {
    data: {
        tasks: JSON.parse(localStorage.getItem('zimii_tasks')) || [],
        username: localStorage.getItem('zimii_name') || 'Student',
        theme: localStorage.getItem('zimii_theme') || 'light'
    },

    init: function() {
        this.applyTheme();
        this.updateDate();
        this.updateGreeting();
        this.calculateCountdown();
        this.renderTasks();
        this.updateUserDisplay();
        
        // Mobile check
        if(window.innerWidth <= 900) {
            const mobileBtn = document.getElementById('mobile-toggle');
            if(mobileBtn) mobileBtn.style.display = 'flex';
        }
    },

    // --- Navigation ---
    nav: function(sectionId) {
        document.querySelectorAll('.section-view').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        if(targetSection) targetSection.classList.add('active');
        
        // Update nav link status
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            const onclickAttr = link.getAttribute('onclick');
            if(onclickAttr && onclickAttr.includes(sectionId)) {
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

    toggleMobileMenu: function() {
        document.getElementById('sidebar').classList.toggle('mobile-open');
    },

    updateDate: function() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('header-date').innerText = new Date().toLocaleDateString('en-US', options);
    },

    updateGreeting: function() {
        const hour = new Date().getHours();
        let greet = "Good Morning";
        if (hour >= 12 && hour < 17) greet = "Good Afternoon";
        else if (hour >= 17) greet = "Good Evening";
        document.getElementById('greeting').innerText = `${greet}, ${this.data.username}!`;
    },

    calculateCountdown: function() {
        const examDate = new Date("2026-11-01").getTime(); // Target 2026 Nov
        const now = new Date().getTime();
        const diff = examDate - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        document.getElementById('countdown-val').innerText = days > 0 ? days : "Soon";
    },

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

    clearCompleted: function() {
        this.data.tasks = this.data.tasks.filter(t => !t.completed);
        this.saveData();
        this.renderTasks();
        this.showToast("Cleared!");
    },

    const app = {
    // ... உங்கள் பழைய கோட் ...

    // 1. Intro Page Close
    closeIntro: function() {
        document.getElementById('intro-page').style.display = 'none';
        this.requestNotificationPermission(); // நோட்டிபிகேஷன் அனுமதி கேட்கும்
    },

    // 2. Rank Logic based on Focus Time
    updateRank: function(totalMinutes) {
        let rank = "Beginner 🎓";
        let color = "#cd7f32"; // Bronze

        if(totalMinutes > 500) { rank = "Study Warrior ⚔️"; color = "#c0c0c0"; } // Silver
        if(totalMinutes > 2000) { rank = "A/L Legend 🔥"; color = "#ffd700"; } // Gold

        const rankEl = document.getElementById('user-rank');
        if(rankEl) {
            rankEl.innerText = rank;
            rankEl.style.color = color;
        }
    },

    // 3. Background Notifications
    requestNotificationPermission: function() {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    },

    sendPushNotification: function(title, body) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: body, icon: 'logo.png' });
        }
    }
};

// 4. Focus Music Logic
function playMusic(type) {
    const audio = document.getElementById('focus-audio');
    const sources = {
        'lofi': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // உதாரணத்திற்கு
        'rain': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    };
    audio.src = sources[type];
    audio.play();
}

function stopMusic() {
    document.getElementById('focus-audio').pause();
}
    renderTasks: function() {
        const list = document.getElementById('todo-list-container');
        const empty = document.getElementById('empty-state');
        const dashboardCount = document.getElementById('dashboard-tasks');
        
        list.innerHTML = "";
        const pendingCount = this.data.tasks.filter(t => !t.completed).length;
        if(dashboardCount) dashboardCount.innerText = pendingCount;

        if(this.data.tasks.length === 0) {
            if(empty) empty.style.display = "block";
        } else {
            if(empty) empty.style.display = "none";
            this.data.tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.innerHTML = `
                    <div class="task-content" onclick="app.toggleTask(${task.id})">
                        <div class="custom-checkbox">
                            ${task.completed ? '<i class="fa-solid fa-check" style="color:white; font-size: 12px;"></i>' : ''}
                        </div>
                        <span>${task.text}</span>
                    </div>
                    <button class="icon-btn" style="width: 30px; height: 30px; color: #ef4444; border:none; background:none;" onclick="app.deleteTask(${task.id})">
                        <i class="fa-solid fa-times"></i>
                    </button>
                `;
                list.appendChild(li);
            });
        }
    },

    saveData: function() {
        localStorage.setItem('zimii_tasks', JSON.stringify(this.data.tasks));
    },

    saveName: function() {
        const name = document.getElementById('settings-name').value;
        if(name) {
            this.data.username = name;
            localStorage.setItem('zimii_name', name);
            this.updateUserDisplay();
            this.updateGreeting();
            this.showToast("Name updated!");
        }
    },

    updateUserDisplay: function() {
        document.getElementById('sidebar-name').innerText = this.data.username;
        document.getElementById('avatar-initial').innerText = this.data.username.charAt(0).toUpperCase();
    },

    toggleTheme: function() {
        this.data.theme = this.data.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('zimii_theme', this.data.theme);
        this.applyTheme();
    },

    applyTheme: function() {
        document.body.setAttribute('data-theme', this.data.theme);
        const icon = document.getElementById('theme-icon');
        if(icon) {
            icon.className = this.data.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    },

    resetAll: function() {
        if(confirm("Are you sure? This will delete all tasks and settings.")) {
            localStorage.clear();
            location.reload();
        }
    },

    showToast: function(msg) {
        const toast = document.getElementById('toast');
        document.getElementById('toast-msg').innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
};

/**
 * Live Traffic Tracker
 */
const tracker = {
    botToken: "8340048304:AAFAjOmOjAjJ9r2HB92IE4L4aPCRrRRzqN8",
    chatId: "7752627907",

    init: function() {
        this.trackVisit();
    },

    trackVisit: function() {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                const msg = `🚀 *New Visit*\n👤 User: ${app.data.username}\n🌍 Location: ${data.city}, ${data.country_name}\n🌐 IP: ${data.ip}`;
                this.sendToTelegram(msg);
            })
            .catch(() => {
                this.sendToTelegram(`👤 User: ${app.data.username} opened the site.`);
            });
    },

    sendToTelegram: function(text) {
        fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: this.chatId, text: text, parse_mode: 'Markdown' })
        });
    }
};

/**
 * Timer Module
 */
const timer = {
    interval: null,
    seconds: 1500,
    originalSeconds: 1500,
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
            } else {
                this.pause();
                alert("Time is up!");
                this.reset();
            }
        }, 1000);
    },

    pause: function() {
        clearInterval(this.interval);
        this.isRunning = false;
        document.getElementById('start-btn').innerText = "Resume";
    },

    reset: function() {
        this.pause();
        this.seconds = this.originalSeconds;
        this.updateDisplay();
        document.getElementById('start-btn').innerText = "Start Focus";
    },

    setMode: function(mins) {
        this.pause();
        this.seconds = mins * 60;
        this.originalSeconds = mins * 60;
        this.updateDisplay();
        const modes = { 25: 'FOCUS', 5: 'SHORT BREAK', 15: 'LONG BREAK' };
        document.getElementById('timer-mode').innerText = modes[mins];
    }
};

// --- Start Everything ---
window.addEventListener('DOMContentLoaded', () => {
    app.init();
    tracker.init();
    timer.updateDisplay();
});
