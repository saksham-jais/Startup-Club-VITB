import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/cultural.jpg';

export default function CulturalRegistration() {
  return <RegistrationForm eventTitle="Cultural Performance Night" qrCode={qr} price={249} hasSeating={false} />;
}