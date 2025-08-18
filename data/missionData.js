// data/missionData.js
// This file acts as our central database for all mission and puzzle content.

export const missions = [
  { id: '1', title: { en: 'Operation Nightingale', pt: 'Projeto Rouxinol' }, difficulty: 'Easy', cipher: 'Caesar' },
  { id: '2', title: { en: 'The Serpent\'s Kiss', pt: 'O Beijo da Serpente' }, difficulty: 'Easy', cipher: 'Atbash' },
  { id: '3', title: { en: 'Viper\'s Nest', pt: 'Covil da Víbora' }, difficulty: 'Medium', cipher: 'Vigenère' },
];

export const puzzleData = {
  '1': {
    plaintext: {
        en: 'MEET AT THE OLD BRIDGE AT MIDNIGHT',
        pt: 'ENCONTRE NA PONTE VELHA A MEIA NOITE'
    },
    hint: {
      en: 'Agent, this is a simple Caesar cipher. Find the correct numerical shift (1-25) to reveal the message.',
      pt: 'Agente, esta é uma cifra de César simples. Encontre o deslocamento numérico correto (1-25) para revelar a mensagem.'
    },
    codex: {
        title: 'Caesar Cipher',
        text: {
            en: 'The Caesar cipher is a substitution cipher where each letter in the plaintext is \'shifted\' a certain number of places down the alphabet. Your task is to find the secret number used for the shift (the key).',
            pt: 'A cifra de César é uma cifra de substituição onde cada letra no texto original é \'deslocada\' um certo número de posições no alfabeto. Sua tarefa é encontrar o número secreto usado para o deslocamento (a chave).'
        }
    }
  },
  '2': {
    plaintext: {
        en: 'THE PACKAGE IS IN THE RED LOCKER',
        pt: 'O PACOTE ESTA NO ARMARIO VERMELHO'
    },
    hint: {
        en: 'This message uses an Atbash cipher, a simple substitution where the alphabet is reversed. No key is needed.',
        pt: 'Esta mensagem usa uma cifra de Atbash, uma substituição simples onde o alfabeto é invertido. Nenhuma chave é necessária.'
    },
    codex: {
        title: 'Atbash Cipher',
        text: {
            en: 'The Atbash cipher is a substitution cipher with a specific, fixed key where the letters of the alphabet are reversed.\n\nThe first letter (\'A\') becomes the last (\'Z\'), the second (\'B\') becomes the second to last (\'Y\'), and so on.\n\nBecause there is only one way to apply it, it requires no key.',
            pt: 'A cifra de Atbash é uma cifra de substituição com uma chave específica e fixa onde as letras do alfabeto são invertidas.\n\nA primeira letra (\'A\') torna-se a última (\'Z\'), a segunda (\'B\') torna-se a penúltima (\'Y\'), e assim por diante.\n\nComo existe apenas uma maneira de aplicá-la, não requer chave.'
        }
    }
  }
};