const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const schedule = require('node-schedule');

const serviceAccount = require('./aba-coin-firebase-adminsdk-t5d7s-a7654e53fb.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


async function resetCountersInBatches() {
  const batchSize = 500;
  let lastDoc = null;
  let usersSnapshot;

  do {
    let query = db.collection('users').orderBy(admin.firestore.FieldPath.documentId()).limit(batchSize);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    usersSnapshot = await query.get();

    if (!usersSnapshot.empty) {
      const batch = db.batch();

      usersSnapshot.forEach((doc) => {
        const userRef = db.collection('users').doc(doc.id);
        batch.update(userRef, { todayAmount: 0 });
      });

      await batch.commit();
      console.log(`Обработано и сброшено ${usersSnapshot.size} документов`);

      lastDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1];
    }
  } while (usersSnapshot.size === batchSize);
}

schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await resetCountersInBatches();
    console.log('Все счётчики обнулены в 00:00 по UTC');
  } catch (error) {
    console.error('Ошибка при обнулении счётчиков:', error);
  }
});


// data for profile
app.get('/user-data/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();

    if (doc.exists) {
      const userData = doc.data();
      res.json({
        status: userData.status || '',
        counter: userData.counter || 0,
        totalClicks: userData.totalAmount || 0,
        walletAddress: userData.walletAddress || '',
      });
    } else {
      res.json({
        status: '',
        counter: 0,
        totalClicks: 0,
        walletAddress: '',
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// data for farm
app.get('/user-data-farm/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();

    if (doc.exists) {
      const userData = doc.data();
      res.json({
        status: userData.status || '',
        counter: userData.counter || 0,
        dailyClicks: userData.todayAmount || 0,
        totalClicks: userData.totalAmount || 0,
      });
    } else {
      res.json({
        status: '',
        counter: 0,
        dailyClicks: 0,
        totalClicks: 0,
      });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// add username on farm-page
app.post('/add-username', async (req, res) => {
    const { username, name } = req.body;

    if (!username || !name) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        const userRef = db.collection('users').doc(username);
        await userRef.set({ name }, { merge: true });
        res.json({ message: 'Username added successfully' });
    } catch (error) {
        console.error('Error adding username:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// update all counters on farm-page
app.post('/update-all', async (req, res) => {
  const { username, counter, dailyClicks, totalClicks } = req.body;

  if (!username || typeof counter === 'undefined' || typeof dailyClicks === 'undefined' || typeof totalClicks === 'undefined') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const userRef = db.collection('users').doc(username);
    await userRef.set({ counter, todayAmount: dailyClicks, totalAmount: totalClicks }, { merge: true });
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// update to premium on farm-tonconnect
app.post('/update-status', async (req, res) => {
  const { username, status } = req.body;

  if (!username || !status) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const userRef = db.collection('users').doc(username);
    await userRef.set({ status }, { merge: true });
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// update wallet on wallet-page
app.post('/update-wallet-data', async (req, res) => {
  const { username, wallet, walletAddress } = req.body;

  if (!username || !wallet || !walletAddress) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const userRef = db.collection('users').doc(username);
    await userRef.set({ wallet, walletAddress }, { merge: true });
    res.json({ message: 'Wallet data updated successfully' });
  } catch (error) {
    console.error('Error updating wallet data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// update counter on wallet-page
app.post('/update', async (req, res) => {
  const { username, counter } = req.body;

  if (!username || typeof counter === 'undefined') {
    return res.status(400).json({ message: 'Invalid data' });
  }

  try {
    const userRef = db.collection('users').doc(username);
    await userRef.set({ counter }, { merge: true });
    res.json({ message: 'Counter updated successfully' });
  } catch (error) {
    console.error('Error updating counter:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on https://bony-dot-timer.glitch.me`);
});
