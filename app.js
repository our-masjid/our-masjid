document.addEventListener("DOMContentLoaded", () => {
    fetch(`data.json?v=${Date.now()}`)
        .then(response => {
            if (!response.ok) throw new Error('JSON फाइल लोड नहीं हो पाई');
            return response.json();
        })
        .then(data => {
            // 1. हेडर सेट करना
            document.getElementById("mosqueName").innerText = data.mosqueName + " तामीर फंड";
            document.getElementById("tagline").innerText = data.tagline;
            document.querySelectorAll(".footer-name").forEach(el => el.innerText = data.mosqueName);

            // 2. दमदार अपील टेक्स्ट इन्जेक्शन
            document.getElementById("appealTitle").innerText = data.appeal.title;
            const paragraphsContainer = document.getElementById("appealParagraphs");
            paragraphsContainer.innerHTML = ""; 
            data.appeal.paragraphs.forEach(text => {
                const p = document.createElement("p");
                p.innerText = text;
                paragraphsContainer.appendChild(p);
            });

            // पते का इत्मीनान कराने वाला हाइलाइट नोट
            document.getElementById("verificationNote").innerHTML = `🔍 <strong>पारदर्शिता नोट:</strong> ${data.appeal.verificationNote}`;

            // 3. प्रोग्रेस बार
            document.getElementById("progressText").innerText = data.progressPercentage + "% पूरा";
            setTimeout(() => {
                document.getElementById("progressBar").style.width = data.progressPercentage + "%";
            }, 300);

            // 4. प्रमाणिक हदीस डेटा
            document.getElementById("hadithArabic").innerText = data.hadith.arabic;
            document.getElementById("hadithText").innerText = data.hadith.translation;
            document.getElementById("hadithRef").innerText = data.hadith.reference;

            // 5. मस्जिद का पता
            document.getElementById("mosqueAddress").innerText = data.address;
            document.getElementById("mapLink").href = data.mapLink;

            // 6. ज़रूरी सामानों की लिस्ट
            // 6. ज़रूरी सामानों की लिस्ट और संपर्क बटन सेटअप
            const matList = document.getElementById("materialList");
            matList.innerHTML = ""; 
            data.materialsNeeded.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `🟢 ${item}`;
                matList.appendChild(li);
            });

            // ✨ [नया जोड़ा गया] सामान के लिए व्हाट्सएप लिंक सेटअप
                        // सामान के लिए व्हाट्सएप लिंक (बिना किसी गलती के)
            const materialMsg = encodeURIComponent("अस्सलामू अलैकुम, मैं मस्जिद तामीर के लिए कुछ कंस्ट्रक्शन का सामान (जैसे सीमेंट/ईंट) दान करना चाहता हूँ। कृपया बताएं कैसे भेजूं?");
            document.getElementById("materialContactBtn").href = "https://wa.me/" + data.manager.phone + "?text=" + materialMsg;


            // 7. तस्वीरें लोड करना (फुल स्क्रीन ज़ूम क्लिक के साथ)
            const photoStack = document.getElementById("photoStack");
            photoStack.innerHTML = ""; 
            data.photos.forEach(photo => {
                const card = document.createElement("div");
                card.className = "photo-card";
                card.innerHTML = `
                    <img src="${photo.src}" alt="${photo.label}" 
                         onerror="this.src='${photo.fallback}'" 
                         onclick="openImagePopup(this.src, '${photo.label}')">
                    <div class="label">${photo.label}</div>
                `;
                photoStack.appendChild(card);
            });

            // 8. पेमेंट डेटा
            document.getElementById("upiAddress").innerText = data.payment.upiId;
            document.getElementById("accountName").innerText = data.payment.accountName;
            
            const qrImgEl = document.getElementById("qrImage");
            qrImgEl.src = data.payment.qrImage;
            qrImgEl.onerror = () => { qrImgEl.src = data.payment.fallbackQrUrl; };

            const upiDeepLink = `upi://pay?pa=${data.payment.upiId}&pn=${encodeURIComponent(data.payment.accountName)}&cu=INR`;
            document.getElementById("payBtn").href = upiDeepLink;

            // 9. देखरेख प्रबंधक प्रोफाइल संपर्क
                        // 9. देखरेख प्रबंधक प्रोफाइल संपर्क (व्हाट्सएप लिंक को बिल्कुल सही फॉर्मेट में सेट किया)
            document.getElementById("managerName").innerText = data.manager.name;
            document.getElementById("managerBio").innerText = data.manager.bio;

            const mgrPhotoEl = document.getElementById("managerPhoto");
            mgrPhotoEl.src = data.manager.photo;
            mgrPhotoEl.onerror = () => { mgrPhotoEl.src = data.manager.fallbackPhoto; };

            // बिल्कुल सही और शुद्ध जावास्क्रिप्ट फॉर्मेट (Template Literal)
            const encodedMsg = encodeURIComponent(data.manager.whatsappMessage);
            const waLink = "https://wa.me/" + data.manager.phone + "?text=" + encodedMsg;
            document.getElementById("whatsappLink").href = waLink;


            // व्यू स्विच (लोडिंग छुपाकर मुख्य कंटेंट ऑन करना)
            document.getElementById("loadingView").style.display = "none";
            document.getElementById("mainContent").style.display = "block";
        })
        .catch(error => {
            console.error(error);
            document.getElementById("loadingView").innerText = "डेटा लोड करने में समस्या आई। कृपया सुनिश्चित करें कि data.json फाइल सही स्थान पर है।";
        });
});

// इमेज पर क्लिक करते ही फुल स्क्रीन पॉपअप खोलने का फंक्शन
function openImagePopup(src, label) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalTargetImg");
    const captionText = document.getElementById("modalCaption");
    
    modal.classList.add("show") ? modal.classList.add("show") : modal.classList.add("show");
    modalImg.src = src;
    captionText.innerText = label;
}

// पॉपअप बंद करने का फंक्शन
function closeImagePopup() {
    const modal = document.getElementById("imageModal");
    modal.classList.remove("show");
}

// UPI कॉपी फंक्शन
function copyUpiId() {
    const upiIdText = document.getElementById("upiAddress").innerText;
    navigator.clipboard.writeText(upiIdText).then(() => {
        alert("UPI ID कॉपी हो गई है!");
    }).catch(err => console.error(err));
}
