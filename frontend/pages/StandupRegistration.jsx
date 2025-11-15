import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/standup.jpg';

export default function StandupRegistration() {
  return <RegistrationForm eventTitle="Standup Comedy Night" qrCode={qr} price={230} hasSeating={true} />;
}