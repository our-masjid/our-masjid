document.addEventListener("DOMContentLoaded", () => {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON फाइल लोड नहीं हो पाई');
            return response.json();
        })
        .then(data => {
            // Inject Header Info
            document.getElementById("mosqueName").innerText = data.mosqueName + " - ऑनलाइन दान";
            document.getElementById("tagline").innerText = data.tagline;
            document.querySelectorAll(".footer-name").forEach(el => el.innerText = data.mosqueName);

            // Inject Appeal Text
            document.getElementById("appealTitle").innerText = data.appeal.title;
            const paragraphsContainer = document.getElementById("appealParagraphs");
            data.appeal.paragraphs.forEach(text => {
                const p = document.createElement("p");
                p.innerText = text;
                paragraphsContainer.appendChild(p);
            });

            // Inject Progress Bar
            document.getElementById("progressText").innerText = data.progressPercentage + "% पूरा";
            setTimeout(() => {
                document.getElementById("progressBar").style.width = data.progressPercentage + "%";
            }, 300);

            // Inject Address
            document.getElementById("mosqueAddress").innerText = data.address;
            document.getElementById("mapLink").href = data.mapLink;

            // Inject Materials
            const matList = document.getElementById("materialList");
            data.materialsNeeded.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `🟢 ${item}`;
                matList.appendChild(li);
            });

            // Inject Photo Stack
            const photoStack = document.getElementById("photoStack");
            data.photos.forEach(photo => {
                const card = document.createElement("div");
                card.className = "photo-card";
                card.innerHTML = `
                    <img src="${photo.src}" alt="${photo.label}" onerror="this.src='${photo.fallback}'">
                    <div class="label">${photo.label}</div>
                `;
                photoStack.appendChild(card);
            });

            // Inject Payments
            document.getElementById("upiAddress").innerText = data.payment.upiId;
            document.getElementById("accountName").innerText = data.payment.accountName;
            
            const qrImgEl = document.getElementById("qrImage");
            qrImgEl.src = data.payment.qrImage;
            qrImgEl.onerror = () => { qrImgEl.src = data.payment.fallbackQrUrl; };

            // Sticky Button UPI Link Setup
            const upiDeepLink = `upi://pay?pa=${data.payment.upiId}&pn=${encodeURIComponent(data.payment.accountName)}&cu=INR`;
            document.getElementById("payBtn").href = upiDeepLink;

            // Switch view from loading to content
            document.getElementById("loadingView").style.display = "none";
            document.getElementById("mainContent").style.display = "block";
        })
        .catch(error => {
            console.error(error);
            document.getElementById("loadingView").innerText = "डेटा लोड करने में समस्या आई। कृपया सुनिश्चित करें कि data.json फाइल सही जगह पर है।";
        });
});

function copyUpiId() {
    const upiIdText = document.getElementById("upiAddress").innerText;
    navigator.clipboard.writeText(upiIdText).then(() => {
        alert("UPI ID कॉपी हो गई है! अब आप अपने पेमेंट ऐप में पेस्ट कर सकते हैं।");
    }).catch(err => console.error(err));
}
