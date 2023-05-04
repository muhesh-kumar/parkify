import { useAtom } from 'jotai';

import Layout from '@layouts/index';
import RealTimeLogs from '@pages/real-time-logs';
import Dashboard from '@pages/dashboard';
import Statistics from '@pages/statistics';

import { selectedNavOptionAtom } from '@state/index';

const App = () => {
  const [selectedNavOption] = useAtom(selectedNavOptionAtom);

  return (
    <Layout>
      {selectedNavOption === 'parking-slots-availability' ? (
        <Dashboard />
      ) : (
        <></>
      )}
      {selectedNavOption === 'real-time-logs' ? <RealTimeLogs /> : <></>}
      {selectedNavOption === 'statistics' ? <Statistics /> : <></>}
    </Layout>
  );
};

export default App;
