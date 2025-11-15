import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/esports.jpg';

export default function EsportsRegistration() {
  return <RegistrationForm eventTitle="Esports Valorant Tournament" qrCode={qr} price={399} hasSeating={false} />;
}