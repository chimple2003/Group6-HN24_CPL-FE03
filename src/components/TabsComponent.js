import { Button, Tab, Tabs } from 'react-bootstrap';
import { useAcountStore } from "../stores/auth"

const TabsComponent = ({ activeKey, defaultActiveKey, handleTabSelect, tabs }) => {
  const { user } = useAcountStore();

  return (
    <>
      {user.username && (
        <div className="text-end">
          <Button variant="dark" href="/topic/initiate">New Topic</Button>
        </div>
      )}

      <Tabs
        className="mb-2"
        activeKey={activeKey}
        defaultActiveKey={defaultActiveKey}
        onSelect={key => handleTabSelect(key)}
      >
        {tabs.map(tab => {
          const tabItem = <Tab eventKey={tab.key} title={tab.label} key={tab.key} />;
          if (tab.visibility === -1) {
            return !user.username ? tabItem : null;
          }
          if (tab.visibility === 1) {
            return user.username ? tabItem : null;
          }
          return tabItem;
        })}
      </Tabs>
    </>
  );
};

export default TabsComponent;
