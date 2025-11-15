import RegistrationForm from '../components/RegistrationForm';
import qr from '../public/qr/podcast.jpg';

export default function PodcastRegistration() {
  return <RegistrationForm eventTitle="Podcast Recording Session" qrCode={qr} price={199} hasSeating={false} />;
}