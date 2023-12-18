import React, { FC, useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { AdminTrainingReschedule } from './AdminTrainingReschedule';
import { AdminUsers } from './AdminUsers';

export enum AdminPanelTabEnum {
  USERS = '1',
  TRAINING_RESCHEDULE = '2',
}

export const AdminPanel: FC = () => {
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const tab = queryParams.get('tab') ?? '';
  const [tabKey, setTabKey] = useState(
    tab && Number.isFinite(Number(tab)) ? tab : '1'
  );

  useEffect(() => {
    if (tab) {
      setTabKey(Number.isFinite(Number(tab)) ? tab : '1');
    }
  }, [tab]);

  return (
    <section>
      <div className="container">
        <article>
          <h2>Admin Panel</h2>
          <Tabs
            variant="tabs"
            id="controlled-tab"
            activeKey={tabKey}
            onSelect={(eventKey) => {
              queryParams.set('tab', eventKey ?? '1');
              history.push({
                pathname: history.location.pathname,
                search: queryParams.toString(),
              });
            }}
          >
            <Tab eventKey={AdminPanelTabEnum.USERS} title="Users">
              <AdminUsers />
            </Tab>
            <Tab eventKey={'3'} title="Reschedule Training">
              <AdminTrainingReschedule />
            </Tab>
          </Tabs>
        </article>
      </div>
    </section>
  );
};

export default AdminPanel;
