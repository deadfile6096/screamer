document.addEventListener('DOMContentLoaded', () => {
    // Initialize welcome screen
    initWelcomeScreen();
    
    // Setup flashlight effect
    setupFlashlight();
    
    // Setup custom cursor
    setupCustomCursor();
    
    // Add event listeners to choices
    setupChoices();
    
    // Запускаем фоновую музыку на экране приветствия
    playWelcomeBackgroundMusic();
    
    // Setup restart button
    document.getElementById('restart-button').addEventListener('click', () => {
        restartGame();
    });
    
    // Add click listener to welcome screen to proceed to game
    document.getElementById('welcome-screen').addEventListener('click', () => {
        startGame();
    });
});

// Initialize welcome screen
function initWelcomeScreen() {
    // Инициализация видео с глазом
    initEyeVideo();
    
    // Type writer effect for title
    const title = "Your blood will be mine...";
    const typingTitle = document.getElementById('typing-title');
    let i = 0;
    
    // Type one character at a time with random delay for creepy effect
    function typeWriter() {
        if (i < title.length) {
            typingTitle.innerHTML += title.charAt(i);
            i++;
            // Random delay between 70ms and 200ms for creepy typing effect
            const randomDelay = Math.floor(Math.random() * 130) + 70;
            setTimeout(typeWriter, randomDelay);
            
            // Add glitch effect randomly
            if (Math.random() > 0.8) {
                typingTitle.classList.add('text-glitch');
                setTimeout(() => {
                    typingTitle.classList.remove('text-glitch');
                }, 150);
            }
        } else {
            // When typing is complete, fade in subtitle
            setTimeout(() => {
                document.getElementById('fade-subtitle').style.opacity = '1';
                document.getElementById('fade-subtitle').style.transition = 'opacity 3s ease';
            }, 500);
        }
    }
    
    // Функция удалена - больше нет эффекта подтёков крови под текстом
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Инициализация видео с глазом и его взаимодействие с курсором
function initEyeVideo() {
    const eyeVideo = document.getElementById('eye-video');
    const eyeContainer = document.querySelector('.eye-video-container');
    
    // Предотвращаем стандартное поведение браузера при клике на видео
    eyeVideo.addEventListener('click', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Предотвращаем открытие контекстного меню
    eyeVideo.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Убедимся, что видео воспроизводится
    eyeVideo.play().catch(e => {
        console.log('Автовоспроизведение видео не удалось:', e);
        
        // Добавим обработчик клика для запуска видео на мобильных устройствах
        document.addEventListener('click', () => {
            eyeVideo.play().catch(e => console.log('Не удалось воспроизвести видео по клику:', e));
        }, { once: true });
    });
    
    // Эффект слежения глаза за курсором
    document.addEventListener('mousemove', (e) => {
        if (!document.getElementById('welcome-screen').classList.contains('active')) return;
        
        const rect = eyeContainer.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        
        // Вычисляем расстояние от центра глаза до курсора
        const distX = e.clientX - eyeCenterX;
        const distY = e.clientY - eyeCenterY;
        
        // Ограничиваем движение глаза
        const maxMove = 10;
        const moveX = Math.max(-maxMove, Math.min(maxMove, distX / 20));
        const moveY = Math.max(-maxMove, Math.min(maxMove, distY / 20));
        
        // Применяем трансформацию к видео внутри контейнера
        eyeVideo.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
}

// Start the game by hiding welcome screen and showing game content
function startGame() {
    // Активируем эффекты перехода
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.classList.add('transition-active');
    
    // Ускоряем видео глаза
    const eyeVideo = document.getElementById('eye-video');
    eyeVideo.playbackRate = 2.0;
    
    // Создаем подтёки крови
    createBloodDrips();
    
    // Активируем яркие блики
    triggerScreenFlashes();
    
    // Воспроизводим звук перехода с высокой громкостью
    playTransitionSound();
    
    // Останавливаем фоновую музыку
    const welcomeBackgroundAudio = document.getElementById('welcome-background-audio');
    welcomeBackgroundAudio.pause();
    
    // Переходим к игре через 3 секунды
    setTimeout(() => {
        welcomeScreen.classList.remove('active', 'transition-active');
        document.getElementById('game').classList.add('active');
        
        // Запускаем фоновое видео
        const backgroundVideo = document.getElementById('background-video');
        if (backgroundVideo) {
            backgroundVideo.play()
                .catch(error => {
                    console.error('Ошибка воспроизведения видео:', error);
                });
        }
        
        initGame();
    }, 3000);
}

// Initialize game state
function initGame() {
    // Show first step
    document.getElementById('step1').style.display = 'block';
    
    // Add flicker effect to some paragraphs randomly
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
        if (Math.random() > 0.7) {
            p.classList.add('flicker');
        }
    });
    
    // Add glitch effect to some text randomly
    paragraphs.forEach(p => {
        if (Math.random() > 0.8) {
            const text = p.innerText;
            p.setAttribute('data-text', text);
            p.classList.add('glitch');
        }
    });
    
    // Add ambient sound
    playAmbientSound();
}

// Flashlight effect following cursor with smooth animation
function setupFlashlight() {
    // Получаем элементы
    const flashlight = document.getElementById('flashlight');
    const welcomeScreen = document.getElementById('welcome-screen');
    
    // Создаем новый элемент для эффекта фонарика на экране приветствия
    // Проверяем, существует ли уже элемент
    let welcomeFlashlight = document.getElementById('welcome-flashlight');
    if (!welcomeFlashlight) {
        welcomeFlashlight = document.createElement('div');
        welcomeFlashlight.id = 'welcome-flashlight';
        welcomeFlashlight.style.position = 'absolute';
        welcomeFlashlight.style.top = '0';
        welcomeFlashlight.style.left = '0';
        welcomeFlashlight.style.width = '100%';
        welcomeFlashlight.style.height = '100%';
        welcomeFlashlight.style.pointerEvents = 'none';
        welcomeFlashlight.style.zIndex = '1';
        welcomeFlashlight.style.mixBlendMode = 'multiply';
        welcomeScreen.appendChild(welcomeFlashlight);
    }
    
    // Функция для определения радиуса фонарика в зависимости от разрешения
    function getFlashlightRadius() {
        if (window.innerWidth >= 3840 || window.innerHeight >= 2160) {
            return 300; // Большой радиус для 4K
        } else if (window.innerWidth >= 1920 || window.innerHeight >= 1080) {
            return 200; // Средний радиус для Full HD
        }
        return 150; // Меньший радиус для низких разрешений
    }
    
    // Variables for smooth animation
    let mouseX = 0;
    let mouseY = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    const ease = 0.1; // Lower value = smoother but slower movement
    
    // Update flashlight position with animation frame
    function updateFlashlightPosition() {
        // Smooth transition to target position
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        
        // Получаем радиус фонарика для текущего разрешения
        const radius = getFlashlightRadius();
        
        // Обновляем градиент для игрового режима
        const gameGradient = `
            radial-gradient(
                circle ${radius}px at ${currentX}px ${currentY}px,
                transparent 10%,
                rgba(0, 0, 0, 0.85) 80%,
                rgba(0, 0, 0, 0.95) 100%
            )
        `;
        flashlight.style.background = gameGradient;
        
        // Обновляем градиент для экрана приветствия
        if (welcomeScreen.classList.contains('active')) {
            const welcomeGradient = `
                radial-gradient(
                    circle ${radius}px at ${currentX}px ${currentY}px,
                    rgba(0, 0, 0, 1) 0%,
                    rgba(0, 0, 0, 0.9) 30%,
                    rgba(0, 0, 0, 0.2) 60%,
                    rgba(0, 0, 0, 0) 100%
                )
            `;
            welcomeFlashlight.style.background = welcomeGradient;
            
            // Highlight text when cursor is near the content
            const welcomeContent = document.querySelector('.welcome-content');
            const rect = welcomeContent.getBoundingClientRect();
            
            // Check if cursor is near the text content
            if (currentX > rect.left && currentX < rect.right && 
                currentY > rect.top && currentY < rect.bottom) {
                welcomeContent.classList.add('highlight-text');
            } else {
                welcomeContent.classList.remove('highlight-text');
            }
        }
        
        requestAnimationFrame(updateFlashlightPosition);
    }
    
    // Start animation loop
    updateFlashlightPosition();
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // For mobile devices
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;
    }, { passive: false });
}

// Custom cursor
function setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
    
    // Expand cursor on button hover
    const buttons = document.querySelectorAll('button, a');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.style.width = '30px';
            cursor.style.height = '30px';
        });
        
        button.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
        });
    });
    
    // Hide default cursor
    document.body.style.cursor = 'none';
}

// Setup choice buttons
function setupChoices() {
    const choices = document.querySelectorAll('.choice');
    
    choices.forEach(choice => {
        choice.addEventListener('click', () => {
            const currentStep = choice.closest('.step');
            const targetStepId = choice.getAttribute('data-target');
            
            // Если это кнопка с джампскейром
            if (choice.classList.contains('wrong')) {
                triggerJumpscare();
                return;
            }
            
            // Если у кнопки есть атрибут data-target
            if (targetStepId) {
                // Скрываем текущий шаг
                currentStep.style.display = 'none';
                
                // Показываем следующий шаг
                const nextStep = document.getElementById(targetStepId);
                if (nextStep) {
                    nextStep.style.display = 'block';
                    
                    // Плавная прокрутка вверх
                    setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
    });
}

// Jumpscare function
function triggerJumpscare() {
    const jumpscare = document.getElementById('jumpscare');
    const screamSound = document.getElementById('scream-sound');
    
    // Предзагрузка звука для быстрого воспроизведения
    screamSound.load();
    
    // Показываем джампскер
    jumpscare.style.opacity = '1';
    jumpscare.style.visibility = 'visible';
    
    // Воспроизводим звук с максимальной громкостью
    screamSound.volume = 1.0;
    screamSound.play()
        .catch(error => {
            console.error('Ошибка воспроизведения звука:', error);
        });
    
    // Эффект мерцания экрана
    let flashCount = 0;
    const maxFlashes = 5;
    const flashInterval = setInterval(() => {
        if (flashCount >= maxFlashes) {
            clearInterval(flashInterval);
            document.body.style.backgroundColor = '';
            return;
        }
        
        document.body.style.backgroundColor = flashCount % 2 === 0 ? '#f00' : '#000';
        flashCount++;
    }, 100);
    
    // Вибрация экрана (если поддерживается)
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 100]);
    }
    
    // Сбрасываем через 2 секунды
    setTimeout(() => {
        // Скрываем джампскер
        jumpscare.style.opacity = '0';
        jumpscare.style.visibility = 'hidden';
        document.body.style.backgroundColor = '#000';
        
        // Останавливаем звук
        screamSound.pause();
        screamSound.currentTime = 0;
        
        // Сбрасываем на первый шаг
        resetToFirstStep();
    }, 2000);
}

// Reset to first step - возвращаем на приветственную страницу
function resetToFirstStep() {
    // Скрываем игровой контент
    document.getElementById('game').classList.remove('active');
    
    // Сбрасываем все шаги
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.style.display = 'none';
    });
    
    // Устанавливаем первый шаг как активный для следующего запуска
    document.getElementById('step1').style.display = 'block';
    
    // Показываем приветственный экран
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.classList.add('active');
    
    // Перезапускаем анимацию печатающегося текста
    initWelcomeScreen();
    
    // Запускаем фоновую музыку
    const welcomeBackgroundAudio = document.getElementById('welcome-background-audio');
    welcomeBackgroundAudio.currentTime = 0;
    welcomeBackgroundAudio.play()
        .catch(error => {
            console.error('Ошибка воспроизведения фоновой музыки:', error);
        });
}

// Restart game
function restartGame() {
    resetToFirstStep();
}

// Sound effects
function playTransitionSound() {
    const transitionAudio = document.getElementById('welcome-transition-audio');
    transitionAudio.volume = 1.0; // Максимальная громкость
    transitionAudio.play();
}

// Фоновая музыка на экране приветствия
function playWelcomeBackgroundMusic() {
    const welcomeBackgroundAudio = document.getElementById('welcome-background-audio');
    welcomeBackgroundAudio.volume = 0.4; // Средняя громкость для фона
    
    // Сначала запускаем звук без звука (обход ограничений браузера)
    welcomeBackgroundAudio.muted = true;
    welcomeBackgroundAudio.play().then(() => {
        // После успешного запуска снимаем приглушение
        setTimeout(() => {
            welcomeBackgroundAudio.muted = false;
        }, 500);
    }).catch(error => {
        console.log('Auto-play prevented. Using click method.');
        
        // Если автозапуск не сработал, используем обработчик клика
        document.addEventListener('click', function startAudio() {
            welcomeBackgroundAudio.muted = false;
            welcomeBackgroundAudio.play()
                .then(() => {
                    document.removeEventListener('click', startAudio);
                })
                .catch(error => {
                    console.error('Error playing audio:', error);
                });
        }, { once: true });
    });
    
    // Дополнительный способ - запуск при взаимодействии с любым элементом
    document.addEventListener('mousemove', function startOnInteraction() {
        welcomeBackgroundAudio.muted = false;
        welcomeBackgroundAudio.play()
            .then(() => {
                document.removeEventListener('mousemove', startOnInteraction);
            })
            .catch(() => {});
    }, { once: true });
}

function playAmbientSound() {
    const audio = new Audio('ambient.mp3');
    audio.loop = true;
    audio.volume = 0.1;
    
    // Play ambient sound on first user interaction
    document.addEventListener('click', () => {
        audio.play().catch(error => {
            console.log('Ambient audio play failed:', error);
        });
    }, { once: true });
}

// Add subtle random sounds
function setupRandomSounds() {
    const sounds = [
        'whisper.mp3',
        'creak.mp3',
        'breath.mp3'
    ];
    
    setInterval(() => {
        if (Math.random() > 0.7) {
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            const audio = new Audio(randomSound);
            audio.volume = 0.2;
            audio.play().catch(error => {
                console.log('Random sound play failed:', error);
            });
        }
    }, 15000);
}

// Preload images
function preloadImages() {
    const jumpscare = new Image();
    jumpscare.src = 'jumpscare.jpg';
}

// Создание подтёков крови сверху экрана
function createBloodDrips() {
    const bloodDripsContainer = document.querySelector('.blood-drips');
    bloodDripsContainer.classList.add('active');
    bloodDripsContainer.innerHTML = ''; // Очищаем контейнер
    
    // Создаем несколько подтёков в случайных местах
    const numDrips = 15;
    
    for (let i = 0; i < numDrips; i++) {
        const drip = document.createElement('div');
        drip.classList.add('blood-drip');
        
        // Случайная позиция по горизонтали
        const leftPos = Math.random() * 100;
        drip.style.left = `${leftPos}%`;
        
        // Случайная ширина подтёка
        const width = Math.random() * 40 + 10;
        drip.style.width = `${width}px`;
        
        // Случайная высота подтёка
        const height = Math.random() * 300 + 100;
        drip.style.height = `${height}px`;
        
        // Случайная задержка появления
        const delay = Math.random() * 1.5;
        drip.style.animation = `blood-drip 2s ease-in ${delay}s forwards`;
        
        // Случайный оттенок красного
        const redShade = Math.floor(Math.random() * 50) + 100;
        drip.style.backgroundColor = `rgb(${redShade}, 0, 0)`;
        
        // Добавляем подтёк в контейнер
        bloodDripsContainer.appendChild(drip);
    }
    
    // Добавляем стиль анимации, если его еще нет
    if (!document.getElementById('blood-drip-style')) {
        const style = document.createElement('style');
        style.id = 'blood-drip-style';
        style.textContent = `
            @keyframes blood-drip {
                0% { transform: translateY(-100%); opacity: 0; }
                10% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(0); opacity: 0.9; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Эффект ярких бликов экрана и синхронизация с подтёками крови
function triggerScreenFlashes() {
    const screenFlash = document.querySelector('.screen-flash');
    const bloodDripsContainer = document.querySelector('.blood-drips');
    
    // Серия быстрых бликов с подтёками крови
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            screenFlash.classList.remove('active');
            
            // Показываем или скрываем подтёки крови в зависимости от мерцания
            if (i % 2 === 0) {
                // Показываем подтёки при четных вспышках
                bloodDripsContainer.classList.remove('reverse');
                bloodDripsContainer.classList.add('active');
                
                // Обновляем подтёки при каждой четной вспышке
                createBloodDrips();
            } else {
                // Скрываем подтёки при нечетных вспышках
                bloodDripsContainer.classList.add('reverse');
                bloodDripsContainer.classList.remove('active');
            }
            
            setTimeout(() => {
                screenFlash.classList.add('active');
            }, 10);
        }, i * 350); // Увеличиваем интервал между вспышками
    }
    
    // Убираем подтёки в конце анимации
    setTimeout(() => {
        bloodDripsContainer.classList.add('reverse');
        bloodDripsContainer.classList.remove('active');
    }, 2800); // Чуть раньше окончания перехода
}

// VHS эффект старой камеры
function setupVHSEffect() {
    // Создаем случайные глитчи
    function randomGlitch() {
        const glitchElement = document.querySelector('.vhs-glitch');
        
        // Случайное смещение экрана
        function createRandomGlitch() {
            // Случайное смещение по вертикали
            const verticalShift = Math.random() > 0.5 ? Math.floor(Math.random() * 10) : 0;
            
            // Применяем смещение
            document.body.style.transform = `translateY(${verticalShift}px)`;
            
            // Увеличиваем непрозрачность глитча
            glitchElement.style.opacity = '0.1';
            
            // Добавляем цветовое смещение
            const rgbShift = document.querySelector('.vhs-rgb-shift');
            rgbShift.style.opacity = '0.1';
            
            // Возвращаем в нормальное состояние через короткое время
            setTimeout(() => {
                document.body.style.transform = '';
                glitchElement.style.opacity = '0';
                rgbShift.style.opacity = '0.03';
            }, 150);
        }
        
        // Создаем серию глитчей
        function glitchSeries() {
            const glitchCount = Math.floor(Math.random() * 3) + 1;
            
            for (let i = 0; i < glitchCount; i++) {
                setTimeout(() => {
                    createRandomGlitch();
                }, i * 200);
            }
        }
        
        // Запускаем глитчи с случайным интервалом
        setInterval(() => {
            if (Math.random() > 0.7) {
                glitchSeries();
            }
        }, 5000);
    }
    
    // Эффект перемотки VHS
    function vhsRewindEffect() {
        // Создаем эффект перемотки каждые 30-60 секунд
        setInterval(() => {
            if (Math.random() > 0.9) {
                // Создаем элемент перемотки
                const rewindOverlay = document.createElement('div');
                rewindOverlay.classList.add('vhs-rewind');
                document.querySelector('.vhs-effect').appendChild(rewindOverlay);
                
                // Стилизуем элемент
                rewindOverlay.style.position = 'fixed';
                rewindOverlay.style.top = '0';
                rewindOverlay.style.left = '0';
                rewindOverlay.style.width = '100%';
                rewindOverlay.style.height = '100%';
                rewindOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                rewindOverlay.style.zIndex = '9990';
                rewindOverlay.style.pointerEvents = 'none';
                
                // Создаем полосы перемотки
                for (let i = 0; i < 10; i++) {
                    const line = document.createElement('div');
                    line.style.position = 'absolute';
                    line.style.width = '100%';
                    line.style.height = '2px';
                    line.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    line.style.top = `${Math.random() * 100}%`;
                    line.style.transform = 'translateY(-50%)';
                    line.style.animation = `vhs-rewind-line ${Math.random() * 0.5 + 0.5}s linear infinite`;
                    rewindOverlay.appendChild(line);
                }
                
                // Удаляем эффект через некоторое время
                setTimeout(() => {
                    rewindOverlay.remove();
                }, 1000);
                
                // Добавляем стиль анимации, если его еще нет
                if (!document.getElementById('vhs-rewind-style')) {
                    const style = document.createElement('style');
                    style.id = 'vhs-rewind-style';
                    style.textContent = `
                        @keyframes vhs-rewind-line {
                            0% { transform: translateX(0) translateY(-50%); }
                            100% { transform: translateX(100%) translateY(-50%); }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        }, 30000);
    }
    
    // Запускаем эффекты
    randomGlitch();
    vhsRewindEffect();
}

// Call preload functions
preloadImages();
setupRandomSounds();
setupVHSEffect();
