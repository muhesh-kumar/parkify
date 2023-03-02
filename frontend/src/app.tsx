import Layout from './components/layout';
import Logs from './components/logs';
import ParkingSlotsAvailability from './components/parking-slots-availability';

const App = () => {
  return (
    <Layout>
      <ParkingSlotsAvailability />
      <Logs />
    </Layout>
  );
};

export default App;
