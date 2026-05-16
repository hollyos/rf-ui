import BaseSettingsCard from '../BaseSettingsCard/BaseSettingsCard';
import WorkflowCard from '../WorkflowCard/WorkflowCard';
import PortalCard from '../PortalCard/PortalCard';
import type { BaseSettingItem, WorkflowItem } from '../../types';
import styles from './SetupGuide.module.scss';
import personPortal from '../../assets/icons/person-portal.svg';

// Static workflow card data. In a real app this would come from an API.
const WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-1',
    title: 'Attendee Registration',
    description: 'Start by creating a general registration workflow',
  },
  {
    id: 'wf-2',
    title: 'Attendee Registration',
    description: 'Start by creating a general registration workflow',
  },
  {
    id: 'wf-3',
    title: 'Attendee Registration',
    description: 'Start by creating a general registration workflow',
  },
];

const BASE_SETTINGS: BaseSettingItem[] = [
  { id: 'general', title: 'General', description: 'Define Attendee types & attributes' },
  {
    id: 't-1',
    title: 'Title',
    description:
      'Description that explains the value goes here. Description that explains the value goes here.',
  },
  {
    id: 't-2',
    title: 'Title',
    description:
      'Description that explains the value goes here. Description that explains the value goes here.',
  },
];

/**
 * SetupGuide: renders the "Event setup guide" preamble, the Attendee
 * section heading with its icon, and the three step blocks (base settings,
 * workflows, post-registration experiences).
 */
export default function SetupGuide(): JSX.Element {
  return (
    <section className={styles.guide} aria-labelledby="guide-heading">
      <header className={styles.heading}>
        <h2 id="guide-heading" className={styles.title}>
          Event setup guide
        </h2>
        <p className={styles.subtitle}>
          See the available list of modules below. We suggest that you start with the attendee
          module.
        </p>
      </header>

      <hr className={styles.divider} />

      <div className={styles.sectionHead}>
        <img src={personPortal} alt="" width="35" height="35" />
        <h3 className={styles.sectionTitle}>Attendee</h3>
      </div>

      <div className={styles.step}>
        <p className={styles.stepLabel}>
          <strong>Step 1:</strong> Base settings.
        </p>
        <BaseSettingsCard items={BASE_SETTINGS} />
      </div>

      <div className={styles.step}>
        <p className={styles.stepLabel}>
          <strong>Step 2:</strong> Build registration workflows.
        </p>
        <div className={styles.workflowGrid}>
          {WORKFLOWS.map((wf) => (
            <WorkflowCard key={wf.id} title={wf.title} description={wf.description} />
          ))}
          <WorkflowCard variant="add" title="Add Registration Workflow" />
        </div>
      </div>

      <div className={styles.step}>
        <p className={styles.stepLabel}>
          <strong>Step 3:</strong> Design post-registration experiences.
        </p>
        <div className={styles.portalRow}>
          <PortalCard
            title="Attendee Portal"
            description="Manage the portal that attendees will see after they’ve register for your event."
          />
        </div>
      </div>
    </section>
  );
}
