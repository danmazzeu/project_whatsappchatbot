const { transferToAttendant } = require('./transferToAttendant');
const sendMedia = require('./sendMedia');

const menuOptions = {
    '1': 'Opção selecionada: *[ 1 ]* Suporte franquia\nEscolha uma opção:\n\n*[ 1.1 ]* Vídeos tutoriais\n*[ 1.2 ]* Documentação PDF\n*[ 1.3 ]* Treinamento\n*[ 1.4 ]* Falar com atendente',
    '1.1': 'Você escolheu *[ 1.1 ]* Vídeos tutoriais.\nAqui estão alguns vídeos tutoriais que podem te ajudar:\n\n- Como utilizar o sistema de forma eficiente.\n- Como integrar a ferramenta com outros sistemas.',
    '1.2': async (message, client) => await sendMedia(message, 'tutorial.pdf', client),
    '1.3': 'Você escolheu *[ 1.3 ]* Treinamento.\nPara agendar um treinamento, entre em contato com nosso suporte.',
    '1.4': (message) => transferToAttendant(message),
    '2': 'Opção selecionada: *[ 2 ]* Suporte maquininha\nEscolha uma opção:\n\n*[ 2.1 ]* Como usar?\n*[ 2.2 ]* Configurações avançadas\n*[ 2.3 ]* Falar com atendente',
    '2.1': 'Você escolheu *[ 2.1 ]* Como usar?\nPara começar, siga as instruções no manual que acompanha a maquininha ou assista ao vídeo tutorial.',
    '2.2': 'Você escolheu *[ 2.2 ]* Configurações avançadas.\nPara acessar configurações avançadas, consulte o manual ou fale com nosso suporte.',
    '2.3': (message) => transferToAttendant(message),
    '3': 'Opção selecionada: *[ 3 ]* Suporte ERP\nEscolha uma opção:\n\n*[ 3.1 ]* FAQ ERP\n*[ 3.2 ]* Contatar Suporte ERP\n*[ 3.3 ]* Falar com atendente',
    '3.1': 'Você escolheu *[ 3.1 ]* FAQ ERP.\nAqui estão as perguntas mais frequentes:\n\n- Como configurar o ERP?\n- Como realizar backups no ERP?',
    '3.2': 'Você pode entrar em contato com o suporte ERP através dos seguintes canais:\n*Email*: suporte@erp.com.br\n*Telefone*: (XX) XXXX-XXXX',
    '3.3': (message) => transferToAttendant(message),
    '4': 'Opção selecionada: *[ 4 ]* Suporte migração\nEscolha uma opção:\n\n*[ 4.1 ]* Como migrar?\n*[ 4.2 ]* Documentação\n*[ 4.3 ]* Falar com atendente',
    '4.1': 'Você escolheu *[ 4.1 ]* Como migrar?\nA migração é feita em etapas. Entre em contato com nosso suporte para guiar o processo.',
    '4.2': async (message, client) => await sendMedia(message, 'documentacao_migracao.pdf', client),
    '4.3': (message) => transferToAttendant(message),
    '5': (message) => transferToAttendant(message),
    '6': 'Opção selecionada: *[ 6 ]* Suporte geral\nEscolha uma opção:\n\n*[ 6.1 ]* Como resetar a senha\n*[ 6.2 ]* Reportar um problema\n*[ 6.3 ]* Falar com atendente',
    '6.1': 'Você escolheu *[ 6.1 ]* Como resetar a senha.\nPara resetar sua senha, clique em "Esqueci minha senha" na tela de login.',
    '6.2': 'Você escolheu *[ 6.2 ]* Reportar um problema.\nSe você está enfrentando algum problema, envie uma descrição detalhada para que possamos te ajudar.',
    '6.3': (message) => transferToAttendant(message),
    'default': 'Bem-vindo ao atendimento automatizado *LLI9*, selecione uma das opções:\n\n*[ 1 ]* Suporte franquia\n*[ 2 ]* Suporte maquininha\n*[ 3 ]* Suporte ERP\n*[ 4 ]* Suporte migração\n*[ 5 ]* Falar com atendente\n*[ 6 ]* Suporte geral'
};

module.exports = menuOptions;