import { Button, Tab, Tabs } from 'react-bootstrap';
import { useAcountStore } from "../stores/auth"

const TabsComponent = ({ activeKey, handleTabSelect }) => {
  const { user } = useAcountStore();

  return (
    <Tabs
      className="mb-2"
      activeKey={activeKey}
      onSelect={(key) => handleTabSelect(key)}
    >
      {user.username && <Tab eventKey="your-feed" title="Your Feed" />}
      <Tab eventKey="global-feed" title="Global Feed" />
      {activeKey.startsWith("tag-") && (
        <Tab eventKey={activeKey} title={`#${activeKey.replace("tag-", "")}`} />
      )}
    </Tabs>
  );
};

export default TabsComponent;
