import { Button } from '@/components/ui/button';
import { ProjectTable } from './ProjectTable';
import { getAuth } from 'firebase/auth';

const ProjectDashboard = () => {
  const auth = getAuth();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center gap-4 border-b px-6">
        <Button variant="ghost" className="h-8">
          Main Table
        </Button>
      </header>
      <div className="flex-1 overflow-auto">
        <ProjectTable key={auth.tenantId} auth={auth} />
      </div>
    </div>
  );
};

export default ProjectDashboard;
