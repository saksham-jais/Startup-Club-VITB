import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/memewar.jpg';

export default function MemeWarRegistration() {
  return <RegistrationForm eventTitle="Meme War Championship" qrCode={qr} price={149} hasSeating={false} />;
}