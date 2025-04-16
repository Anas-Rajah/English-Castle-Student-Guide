// --- Navigation Scrollspy ---
const navLinks = document.querySelectorAll(".main-nav .nav-links a");
const sections = document.querySelectorAll(".content-section");
const mainNav = document.getElementById("mainNav");
const topNavHeightMobile =
  parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--top-nav-height-mobile"
    )
  ) || 70;
const menuToggle = document.getElementById("menuToggle"); // Hamburger button

function activateNavLink() {
  let currentSectionId = sections[0]?.getAttribute("id") || ""; // Default to first section
  const scrollPosition = window.scrollY;
  const offset = window.innerWidth >= 768 ? 50 : topNavHeightMobile + 20; // Adjusted offset for mobile

  sections.forEach((section) => {
    // Calculate the top and bottom of the section considering the offset
    const sectionTop = section.offsetTop - offset;
    const sectionBottom = sectionTop + section.offsetHeight;

    // Check if the scroll position is within the section's boundaries
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSectionId = section.getAttribute("id");
    }
  });

  // Special case for reaching bottom of page (more robust check)
  const bottomScrollPosition = window.innerHeight + window.scrollY;
  const totalHeight = document.documentElement.scrollHeight; // More reliable than body.offsetHeight
  if (bottomScrollPosition >= totalHeight - 50) {
    // Check if near bottom
    const lastSection = sections[sections.length - 1];
    if (lastSection) {
      currentSectionId = lastSection.getAttribute("id");
    }
  }
  // Check if scrolled above the first section
  else if (scrollPosition < sections[0].offsetTop - offset) {
    currentSectionId = sections[0].getAttribute("id"); // Highlight first section if above it
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSectionId}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", activateNavLink);
window.addEventListener("load", activateNavLink); // Activate on load

// --- Hamburger Menu Toggle ---
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("nav-active");
    const isExpanded = mainNav.classList.contains("nav-active");
    menuToggle.setAttribute("aria-expanded", isExpanded);
    menuToggle
      .querySelector("i")
      .classList.toggle("fa-bars", !isExpanded);
    menuToggle
      .querySelector("i")
      .classList.toggle("fa-times", isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (
        window.innerWidth < 768 &&
        mainNav.classList.contains("nav-active")
      ) {
        mainNav.classList.remove("nav-active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector("i").classList.remove("fa-times");
        menuToggle.querySelector("i").classList.add("fa-bars");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (
      window.innerWidth < 768 &&
      mainNav.classList.contains("nav-active")
    ) {
      const isClickInsideNav = mainNav.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);
      if (!isClickInsideNav && !isClickOnToggle) {
        mainNav.classList.remove("nav-active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.querySelector("i").classList.remove("fa-times");
        menuToggle.querySelector("i").classList.add("fa-bars");
      }
    }
  });
}

// --- FAQ Accordion Functionality ---
function toggleFAQ(element) {
  const question = element;
  const answer = question.nextElementSibling;
  const isActive = question.classList.contains("active");

  const currentActiveQuestion = document.querySelector(
    ".faq-question.active"
  );
  if (currentActiveQuestion && currentActiveQuestion !== question) {
    currentActiveQuestion.classList.remove("active");
    const currentActiveAnswer = currentActiveQuestion.nextElementSibling;
    currentActiveAnswer.classList.remove("active");
    currentActiveAnswer.style.maxHeight = null;
    currentActiveAnswer.style.paddingTop = "0px";
    currentActiveAnswer.style.paddingBottom = "0px";
  }

  question.classList.toggle("active");
  answer.classList.toggle("active");

  if (answer.classList.contains("active")) {
    answer.style.paddingTop = "5px";
    answer.style.paddingBottom = "15px";
    answer.style.maxHeight = answer.scrollHeight + "px";
  } else {
    answer.style.maxHeight = null;
    setTimeout(() => {
      if (!answer.classList.contains("active")) {
        answer.style.paddingTop = "0px";
        answer.style.paddingBottom = "0px";
      }
    }, 400);
  }
}

// --- Chatbot Functionality ---
const chatbotWindow = document.getElementById("chatbotWindow");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotButton = document.querySelector(".chatbot-button");

function toggleChatbot() {
  const isActive = chatbotWindow.classList.toggle("active");
  chatbotButton.style.animation = isActive
    ? "none"
    : "pulse 2s infinite ease-in-out";
  if (isActive) {
    setTimeout(() => chatbotInput.focus(), 300);
  }
}
function sendMessage() {
  const message = chatbotInput.value.trim();
  if (message !== "") {
    addMessage(message, "user");
    chatbotInput.value = "";
    chatbotInput.disabled = true;
    const sendButton = chatbotInput.nextElementSibling;
    sendButton.disabled = true;

    setTimeout(() => {
      const botResponse = getBotResponse(message);
      addMessage(botResponse, "bot");
      chatbotInput.disabled = false;
      sendButton.disabled = false;
      chatbotInput.focus();
    }, 800 + Math.random() * 500);
  }
}
function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
function addMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender + "-message");
  messageElement.textContent = message;
  chatbotMessages.appendChild(messageElement);
  chatbotMessages.scrollTo({
    top: chatbotMessages.scrollHeight,
    behavior: "smooth",
  });
}
function getBotResponse(message) {
  message = message.toLowerCase().replace(/[?؟!,.]/g, "");
  if (
    message.includes("تسجيل") ||
    message.includes("اسجل") ||
    message.includes("اشتراك") ||
    message.includes("انضم")
  ) {
    return 'للتسجيل، يرجى اتباع الخطوات الموضحة في خريطة الطريق بقسم "التسجيل". تبدأ بإدخال بياناتك ثم اختيار الفترة والدفع وإجراء الاختبارات.';
  } else if (
    message.includes("دفع") ||
    message.includes("رسوم") ||
    message.includes("سعر") ||
    message.includes("تكلفة") ||
    message.includes("فلوس")
  ) {
    return 'تتوفر لدينا طرق دفع متنوعة تشمل البطاقات الائتمانية والتحويل البنكي والمحافظ الإلكترونية. تجد التفاصيل في قسم "آلية الدفع". لمعرفة الرسوم الدقيقة لدورة معينة، يرجى مراجعة صفحة الدورة أو التواصل مع خدمة العملاء.';
  } else if (
    message.includes("زوم") ||
    message.includes("zoom") ||
    message.includes("حصة") ||
    message.includes("اونلاين") ||
    message.includes("اون لاين")
  ) {
    return 'نستخدم Zoom للحصص المباشرة. تأكد من تحميله وتثبيته من الروابط في قسم "برنامج ZOOM". ستجد رابط الحصة في بوابة الطالب قبل موعدها.';
  } else if (
    message.includes("مستوى") ||
    message.includes("تحديد مستوى") ||
    message.includes("اختبار")
  ) {
    return "يتم تحديد المستوى بدقة عبر اختبارين: كتابي (أونلاين) وشفهي (مقابلة عبر Zoom). هذا يضمن وضعك في الفصل المناسب لقدراتك الحالية.";
  } else if (message.includes("شهادة") || message.includes("معتمد")) {
    return "نعم بالتأكيد، تحصل على شهادة إتمام معتمدة من English Castle بعد إكمال كل مستوى بنجاح واستيفاء متطلباته.";
  } else if (
    message.includes("مساعدة") ||
    message.includes("دعم") ||
    message.includes("مشكلة") ||
    message.includes("اتواصل") ||
    message.includes("رقم")
  ) {
    return 'فريق الدعم جاهز لمساعدتك! يمكنك التواصل معنا عبر الهاتف [ضع الرقم هنا]، البريد الإلكتروني support@englishcastle.com، أو الواتساب [ضع الرقم هنا إن وجد]. تجد كل طرق التواصل في قسم "الدعم" بالصفحة.';
  } else if (message.includes("شكرا") || message.includes("شكرًا")) {
    return "على الرحب والسعة! سعيد بمساعدتك. هل هناك أي شيء آخر؟";
  } else if (
    message.includes("اهلا") ||
    message.includes("مرحبا") ||
    message.includes("سلام")
  ) {
    return "أهلاً بك! كيف أقدر أساعدك اليوم في English Castle؟";
  } else {
    const randomResponses = [
      "لم أفهم طلبك تماماً. هل يمكنك إعادة صياغته بوضوح؟ يمكنك سؤالي عن التسجيل، الدفع، زووم، أو الدراسة.",
      "عذراً، أنا مصمم للمساعدة في استفسارات English Castle الأساسية. هل سؤالك يتعلق بالتسجيل، الدفع، الدراسة، أو برنامج Zoom؟",
      "شكراً لتواصلك. هل يمكنني توجيهك لقسم معين في هذه الصفحة؟ جرب السؤال عن 'التسجيل' أو 'الدفع' مثلاً.",
    ];
    return randomResponses[
      Math.floor(Math.random() * randomResponses.length)
    ];
  }
}

// --- Set current year in footer ---
document.getElementById("currentYear").textContent =
  new Date().getFullYear();