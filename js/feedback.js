document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedbackForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (typeof db === "undefined") {
            alert("Database not initialized ❌");
            return;
        }

        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let type = document.getElementById("type").value;
        let message = document.getElementById("message").value.trim();

        if (!name || !email || !type || !message) {
            alert("Please fill all required fields");
            return;
        }

        try {
            await db.collection("feedback").add({
                name,
                email,
                phone,
                type,
                message,
                created: new Date()
            });

            alert("Feedback submitted successfully ✅");
            form.reset();

        } catch (err) {
            alert("Error: " + err.message);
        }
    });
});