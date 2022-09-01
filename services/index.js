const fs = require('fs').promises;
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

async function getTalkers() {
  const fileContent = await fs.readFile('./talker.json', 'utf-8');
  const talkers = JSON.parse(fileContent);
  return talkers;
}

async function writeFile(element) {
  await fs.writeFile('./talker.json',
  JSON.stringify(element));
}

async function returnTalkers(_req, res) {
  const talkers = await getTalkers();
  return res.status(200).json(talkers);
}

async function getTalkersById(req, res) {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talker = talkers.find((item) => item.id === Number(id));
  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  res.status(200).json(talker);
}

async function signup(req, res) {
  const validationEmail = /\S+@\S+\.\S+/;
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (validationEmail.test(email) === false) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  const token = generateToken();
  res.status(200).json({ token });
}

async function addTalker(req, res) {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await getTalkers();
  const id = (talkers[talkers.length - 1].id) + 1;
  talkers.push({ id, name, age, talk: { rate, watchedAt } });
  await writeFile(talkers);
  return res.status(201).json(talkers[talkers.length - 1]);
}

async function editTalker(req, res) {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await getTalkers();
  const talkerIndex = talkers.findIndex((item) => item.id === Number(id));
  talkers[talkerIndex] = { ...talkers[talkerIndex], name, age, talk: { watchedAt, rate } };
  await writeFile(talkers);
  res.status(200).json(talkers[talkerIndex]);
}

async function deleteTalker(req, res) {
  const { id } = req.params;
  const talkers = await getTalkers();
  const talkerIndex = talkers.findIndex((item) => item.id === Number(id));
  talkers.splice(talkerIndex, 1);
  await writeFile(talkers);
  res.status(204).end();
}

async function searchTalker(req, res, next) {
  const { q } = req.query;
  if (!q) return next();
  const talkers = await getTalkers();
  const filterTalker = talkers.filter((item) => item.name.includes(q));
  res.status(200).json(filterTalker);
}

module.exports = {
  getTalkers,
  getTalkersById,
  signup,
  addTalker,
  returnTalkers,
  editTalker,
  deleteTalker,
  searchTalker,
};