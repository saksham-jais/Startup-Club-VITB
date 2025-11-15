import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/ideathon.jpg';

export default function IdeathonRegistration() {
  return <RegistrationForm eventTitle="Ideathon 2025" qrCode={qr} price={299} hasSeating={false} />;
}