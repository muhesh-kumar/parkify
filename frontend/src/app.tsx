import { useAtom } from 'jotai';

import Layout from '@components/layout';
import Logs from '@components/logs';
import ParkingSlotsAvailability from '@components/parking-slots-availability';
import Statistics from '@components/statistics';

import { selectedNavOptionAtom } from '@state/index';

const App = () => {
  const [selectedNavOption] = useAtom(selectedNavOptionAtom);
  return (
    <Layout>
      {selectedNavOption === 'parking-slots-availability' ? (
        <ParkingSlotsAvailability />
      ) : (
        <></>
      )}
      {selectedNavOption === 'real-time-logs' ? <Logs /> : <></>}
      {selectedNavOption === 'statistics' ? <Statistics /> : <></>}
    </Layout>
  );
};

export default App;
