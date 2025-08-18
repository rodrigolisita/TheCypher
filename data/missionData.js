// This file acts as our central database for all mission and puzzle content.

export const missions = [
  { id: '1', title: { en: 'Operation Nightingale', pt: 'Projeto Rouxinol' }, difficulty: 'Easy', cipher: 'Caesar' },
  { id: '2', title: { en: 'The Serpent\'s Kiss', pt: 'O Beijo da Serpente' }, difficulty: 'Easy', cipher: 'Atbash' },
  { id: '3', title: { en: 'Viper\'s Nest', pt: 'Covil da Víbora' }, difficulty: 'Medium', cipher: 'Vigenère' },
  { id: '4', title: { en: 'Ghost Protocol', pt: 'Protocolo Fantasma' }, difficulty: 'Hard', cipher: 'Asymmetric' },
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
  },
  '3': {
    plaintext: {
        en: 'THE EAGLE HAS LANDED',
        pt: 'A AGUIA POUSOU'
    },
    key: 'SECRET',
    hintedKey: 'S_CR_T', // The fill-in-the-blanks hint for the user
    hint: {
        en: 'This Vigenère cipher uses a keyword. Complete the keyword to decrypt the message.',
        pt: 'Esta cifra de Vigenère usa uma palavra-chave. Complete a palavra-chave para descriptografar a mensagem.'
    },
    codex: {
        title: 'Vigenère Cipher',
        text: {
            en: 'The Vigenère cipher is a polyalphabetic substitution cipher.\n\nIt uses a keyword to apply a series of Caesar ciphers based on the letters of the keyword.\n\nFor example, if the keyword is \'KEY\', the first letter of the message is shifted by \'K\', the second by \'E\', the third by \'Y\', the fourth by \'K\' again, and so on.',
            pt: 'A cifra de Vigenère é uma cifra de substituição polialfabética.\n\nEla usa uma palavra-chave para aplicar uma série de cifras de César com base nas letras da palavra-chave.\n\nPor exemplo, se a palavra-chave for \'KEY\', a primeira letra da mensagem é deslocada por \'K\', a segunda por \'E\', a terceira por \'Y\', a quarta por \'K\' novamente, e assim por diante.'
        }
    }
  },
  '4': {
    plaintext: {
        en: 'MESSAGE IS YELLOW', // The solution is the color itself
        pt: 'A MENSAGEM É AMARELA'
    },
    publicKey: 'BLUE',
    message: 'YELLOW',
    privateKey: 'BLUE', // The "filter" to remove the public key
    filterOptions: ['RED', 'BLUE', 'GREEN'],
    hint: {
        en: 'Agent, this is an asymmetric encryption. Use your private key filter to isolate the original message color.',
        pt: 'Agente, esta é uma criptografia assimétrica. Use seu filtro de chave privada para isolar a cor da mensagem original.'
    },
    codex: {
        title: 'Asymmetric Keys',
        text: {
            en: 'Asymmetric encryption uses two keys: a public key and a private key.\n\n1. A message (YELLOW) is encrypted using a PUBLIC key (BLUE), creating a new result (GREEN).\n\n2. Anyone can see the public key and the final result, but only you have the PRIVATE key filter.\n\n3. Your task is to select the correct private key filter to reverse the encryption and find the original message color.',
            pt: 'A criptografia assimétrica usa duas chaves: uma chave pública e uma chave privada.\n\n1. Uma mensagem (AMARELO) é criptografada usando uma chave PÚBLICA (AZUL), criando um novo resultado (VERDE).\n\n2. Qualquer um pode ver a chave pública e o resultado final, mas apenas você tem o filtro da chave PRIVADA.\n\n3. Sua tarefa é selecionar o filtro de chave privada correto para reverter a criptografia e encontrar a cor da mensagem original.'
        }
    }
  }
};
