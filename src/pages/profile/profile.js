window.Telegram.WebApp.ready();

async function fetchCounter(username) {
    try {
        const response = await fetch(`https://bony-dot-timer.glitch.me/counter/${username}`);
        if (response.ok) {
            const data = await response.json();
            return data.counter || 0;
        } else {
            console.error('Failed to fetch counter:', response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error fetching counter:', error);
        return 0;
    }
}

async function fetchTotalAmount(username) {
    try {
        const response = await fetch(`https://bony-dot-timer.glitch.me/total-clicks/${username}`);
        if (response.ok) {
            const data = await response.json();
            return data.totalClicks || 0;
        } else {
            console.error('Failed to fetch total amount:', response.statusText);
            return 0;
        }
    } catch (error) {
        console.error('Error fetching total amount:', error);
        return 0;
    }
}

async function fetchWalletAddress(username) {
    try {
        const response = await fetch(`https://bony-dot-timer.glitch.me/wallet-address/${username}`);
        if (response.ok) {
            const data = await response.json();
            return data.walletAddress || "No wallet address, bro";
        } else {
            console.error('Failed to fetch wallet address:', response.statusText);
            return "Error fetching wallet address";
        }
    } catch (error) {
        console.error('Error fetching wallet address:', error);
        return "Error fetching wallet address";
    }
}

function copyWalletAddress(walletAddress) {
    navigator.clipboard.writeText(walletAddress).then(() => {
        const notification = document.getElementById('copy-notification');
        notification.classList.remove('hidden');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 2000);
    });
}

async function displayUserInfo() {
    try {
        const user = window.Telegram.WebApp.initDataUnsafe.user;

        if (!user) {
            document.getElementById('user-info').innerText = "ooooops, bro, I'm so embarrassed, I can't find any information about you. Please, sorry me, bro!)";
            return;
        }

        // Fetching the wallet address, counter, and total amount
        const [walletAddress, counter, totalAmount] = await Promise.all([
            fetchWalletAddress(user.username),
            fetchCounter(user.username),
            fetchTotalAmount(user.username)
        ]);

        const profileHTML = `
            <img src="${user.photo_url || '../../assets/aba_circle.png'}" alt="User Image" class="profile-image">
            <ul class="user-details">
                <li>
                    <strong></strong> ${
                        user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.first_name
                        ? user.first_name
                        : user.last_name
                        ? user.last_name
                        : "you are noname, bro"
                    }
                </li>
                <li><strong></strong> @${user.username || "you haven't username, bro"}</li>
                <li><strong>you can cash now:</strong> ${counter}</li>
                <li><strong>total score:</strong> ${totalAmount}</li>
                <li><strong>wallet address:</strong> <span class="wallet-address-info" onclick="copyWalletAddress('${walletAddress}')">${walletAddress}</span></li>
            </ul>
            <div id="copy-notification" class="hidden">Copied, bro!</div>
        `;
        
        document.getElementById('user-info').innerHTML = profileHTML;

    } catch (error) {
        console.error("Error displaying user info:", error);
        document.getElementById('user-info').innerText = "no information about user";
    }
}

displayUserInfo();