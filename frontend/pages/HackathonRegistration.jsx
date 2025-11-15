import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/hackathon.jpg';

export default function HackathonRegistration() {
  return <RegistrationForm eventTitle="National Hackathon 2025" qrCode={qr} price={499} hasSeating={false} />;
}