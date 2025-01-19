import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const Terms = ({ open, onClose, setIsChecked, language }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="terms-title" aria-describedby="terms-description">
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          maxHeight: '80vh', 
          overflowY: 'auto', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          borderRadius: 2 
        }}
      >
        <Typography id="terms-title" variant="h6" component="h2" gutterBottom>
          {language === 'Spanish' ? 'Términos y Condiciones' : language === 'English' ? 'Terms and Conditions' : 'Conditions d\'utilisation'}
        </Typography>

        <Typography id="terms-description" variant="body1" paragraph>
          {language === 'Spanish' 
            ? 'Bienvenido a nuestro reproductor m3u LatinoDigital. Al usar esta aplicación, aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente.'
            : language === 'English'
            ? 'Welcome to our m3u LatinoDigital Player. By using this application, you agree to the following terms and conditions. Please read them carefully.'
            : 'Bienvenue sur notre lecteur m3u LatinoDigital. En utilisant cette application, vous acceptez les termes et conditions suivants. Veuillez les lire attentivement.'}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {language === 'Spanish' ? 'Exención de Responsabilidad' : language === 'English' ? 'Disclaimer of Responsibility' : 'Exonération de Responsabilité'}
        </Typography>
        <Typography variant="body1" paragraph>
          {language === 'Spanish' 
            ? 'Esta aplicación es un reproductor multimedia diseñado para reproducir enlaces m3u proporcionados por los usuarios. No aloja, proporciona ni incluye ningún contenido o transmisiones multimedia. Todos los enlaces m3u son ingresados y gestionados por el usuario.'
            : language === 'English'
            ? 'This application is a media player designed to play m3u links provided by users. It does not host, provide, or include any media content or streams. All m3u links are input and managed by the user.'
            : 'Cette application est un lecteur multimédia conçu pour lire des liens m3u fournis par les utilisateurs. Elle ne contient pas, ne fournit pas et n\'inclut aucun contenu ou flux multimédia. Tous les liens m3u sont saisis et gérés par l\'utilisateur.'}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {language === 'Spanish' ? 'Responsabilidad Legal' : language === 'English' ? 'Legal Responsibility' : 'Responsabilité Légale'}
        </Typography>
        <Typography variant="body1" paragraph>
          {language === 'Spanish' 
            ? 'Es responsabilidad exclusiva del usuario asegurarse de que los enlaces m3u que utiliza cumplen con las leyes de derechos de autor y otras regulaciones aplicables. No apoyamos ni promovemos el uso de contenido ilegal o no autorizado.'
            : language === 'English'
            ? 'It is solely the responsibility of the user to ensure that the m3u links they use comply with copyright laws and other applicable regulations. We do not endorse or promote the use of illegal or unauthorized content.'
            : 'Il est de la seule responsabilité de l\'utilisateur de s\'assurer que les liens m3u qu\'il utilise respectent les lois sur le droit d\'auteur et autres réglementations applicables. Nous ne soutenons ni ne promouvons l\'utilisation de contenu illégal ou non autorisé.'}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {language === 'Spanish' ? 'Sin Responsabilidad' : language === 'English' ? 'No Liability' : 'Aucune Responsabilité'}
        </Typography>
        <Typography variant="body1" paragraph>
          {language === 'Spanish' 
            ? 'No somos responsables del contenido al que se accede a través de este reproductor, ni somos responsables de las consecuencias derivadas del uso de enlaces ilegales o no autorizados. Al utilizar esta aplicación, reconoces y aceptas esta responsabilidad.'
            : language === 'English'
            ? 'We are not responsible for the content accessed through this player, nor are we liable for any consequences arising from the use of illegal or unauthorized links. By using this application, you acknowledge and accept this responsibility.'
            : 'Nous ne sommes pas responsables du contenu auquel on accède via ce lecteur, ni de toute conséquence découlant de l\'utilisation de liens illégaux ou non autorisés. En utilisant cette application, vous reconnaissez et acceptez cette responsabilité.'}
        </Typography>

        <Typography variant="h6" gutterBottom>
          {language === 'Spanish' ? 'Acuerdo del Usuario' : language === 'English' ? 'User Agreement' : 'Contrat d\'Utilisateur'}
        </Typography>
        <Typography variant="body1" paragraph>
          {language === 'Spanish' 
            ? 'Al utilizar esta aplicación, aceptas estos términos y condiciones. Si no estás de acuerdo, por favor abstente de usar la aplicación.'
            : language === 'English'
            ? 'By using this application, you agree to these terms and conditions. If you do not agree, please refrain from using the application.'
            : 'En utilisant cette application, vous acceptez ces termes et conditions. Si vous n\'acceptez pas, veuillez vous abstenir d\'utiliser l\'application.'}
        </Typography>

        <Button variant="contained" color="primary" onClick={() => {
          setIsChecked(true);
          onClose();
        }} fullWidth sx={{ mt: 2 }}>
          {language === 'Spanish' ? 'Aceptar' : language === 'English' ? 'Accept' : 'Accepter'}
        </Button>
        <Button variant="contained" color="primary" onClick={() => {
          setIsChecked(false);
          onClose();
        }} fullWidth sx={{ mt: 2 }}>
          {language === 'Spanish' ? 'Cerrar' : language === 'English' ? 'Close' : 'Fermer'}
        </Button>
      </Box>
    </Modal>
  );
};

export default Terms;
