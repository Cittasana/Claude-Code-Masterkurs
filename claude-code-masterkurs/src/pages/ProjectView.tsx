import { Link } from 'react-router-dom';
import { Code, CheckCircle2 } from 'lucide-react';

const ProjectView = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-github-muted mb-6">
        <Link to="/dashboard" className="hover:text-github-emphasis">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-github-text">Projekte</span>
      </div>

      {/* Coming Soon */}
      <div className="lesson-card text-center py-16">
        <Code className="mx-auto text-github-emphasis mb-4" size={64} />
        <h1 className="text-3xl font-bold text-github-text mb-4">
          🚀 Projekte kommen bald!
        </h1>
        <p className="text-github-muted mb-8 max-w-2xl mx-auto">
          Die praktischen Real-Life Projekte mit automatischer Validierung werden in der nächsten
          Iteration hinzugefügt. Bleib dran!
        </p>

        <div className="bg-github-bg border border-github-border rounded-lg p-6 max-w-2xl mx-auto text-left">
          <h3 className="text-lg font-semibold text-github-text mb-4">
            Geplante Projekte:
          </h3>
          <div className="space-y-3">
            {[
              'File Manager CLI Tool',
              'CLAUDE.md Generator',
              'Context Analyzer',
              'Custom MCP Server',
              'Multi-Agent Data Pipeline',
              'Autonomous Code Review Agent',
            ].map((project, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle2 className="text-github-muted" size={16} />
                <span className="text-github-text">{project}</span>
              </div>
            ))}
          </div>
        </div>

        <Link to="/dashboard" className="btn-primary mt-8 inline-block">
          Zurück zum Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProjectView;
