import React, { useMemo, useState } from 'react';

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'High' | 'Medium' | 'Low';

interface TaskItem {
  id: string;
  title: string;
  program: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
}

const TASKS: TaskItem[] = [
  { id: 'TSK-001', title: 'Finalize baseline survey tool', program: 'SEEP', assignee: 'SA', dueDate: '2026-02-23', status: 'in_progress', priority: 'High', progress: 72 },
  { id: 'TSK-002', title: 'Beneficiary verification batch 3', program: 'Relief', assignee: 'EM', dueDate: '2026-02-22', status: 'review', priority: 'High', progress: 88 },
  { id: 'TSK-003', title: 'Monthly nutrition report cleanup', program: 'Nutrition', assignee: 'JK', dueDate: '2026-02-26', status: 'todo', priority: 'Medium', progress: 20 },
  { id: 'TSK-004', title: 'Quarterly loans performance brief', program: 'Finance', assignee: 'PM', dueDate: '2026-02-28', status: 'in_progress', priority: 'Medium', progress: 53 },
  { id: 'TSK-005', title: 'GBV case form QA checks', program: 'GBV', assignee: 'CN', dueDate: '2026-02-21', status: 'review', priority: 'High', progress: 91 },
  { id: 'TSK-006', title: 'Program milestone tagging migration', program: 'Programs', assignee: 'AN', dueDate: '2026-03-01', status: 'todo', priority: 'Low', progress: 12 },
  { id: 'TSK-007', title: 'Activity evidence cross-validation', program: 'M&E Core', assignee: 'SA', dueDate: '2026-02-24', status: 'in_progress', priority: 'Medium', progress: 64 },
  { id: 'TSK-008', title: 'Close completed January tasks', program: 'Operations', assignee: 'MO', dueDate: '2026-02-20', status: 'done', priority: 'Low', progress: 100 }
];

const STATUS_META: Record<TaskStatus, { label: string; accent: string; chip: string }> = {
  todo: { label: 'To Do', accent: '#F59E0B', chip: 'rgba(245,158,11,0.22)' },
  in_progress: { label: 'In Progress', accent: '#3B82F6', chip: 'rgba(59,130,246,0.22)' },
  review: { label: 'Review', accent: '#A855F7', chip: 'rgba(168,85,247,0.22)' },
  done: { label: 'Done', accent: '#22C55E', chip: 'rgba(34,197,94,0.22)' }
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  High: '#EF4444',
  Medium: '#F59E0B',
  Low: '#22C55E'
};

const TaskPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');

  const filteredTasks = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    return TASKS.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      if (!normalized) return true;
      return (
        task.title.toLowerCase().includes(normalized) ||
        task.id.toLowerCase().includes(normalized) ||
        task.program.toLowerCase().includes(normalized) ||
        task.assignee.toLowerCase().includes(normalized)
      );
    });
  }, [priorityFilter, searchTerm, statusFilter]);

  const groupedTasks = useMemo(() => {
    return (Object.keys(STATUS_META) as TaskStatus[]).reduce((accumulator, status) => {
      accumulator[status] = filteredTasks.filter((task) => task.status === status);
      return accumulator;
    }, {} as Record<TaskStatus, TaskItem[]>);
  }, [filteredTasks]);

  const summary = useMemo(() => {
    const now = new Date('2026-02-20T00:00:00');
    const completed = filteredTasks.filter((task) => task.status === 'done').length;
    const overdue = filteredTasks.filter((task) => task.status !== 'done' && new Date(task.dueDate) < now).length;
    const avgProgress = filteredTasks.length
      ? Math.round(filteredTasks.reduce((total, task) => total + task.progress, 0) / filteredTasks.length)
      : 0;

    return {
      total: filteredTasks.length,
      completed,
      overdue,
      avgProgress
    };
  }, [filteredTasks]);

  const workload = useMemo(() => {
    const grouped = new Map<string, { total: number; done: number }>();
    filteredTasks.forEach((task) => {
      const current = grouped.get(task.assignee) || { total: 0, done: 0 };
      current.total += 1;
      if (task.status === 'done') current.done += 1;
      grouped.set(task.assignee, current);
    });

    return Array.from(grouped.entries()).map(([assignee, stats]) => ({
      assignee,
      total: stats.total,
      completion: stats.total ? Math.round((stats.done / stats.total) * 100) : 0
    }));
  }, [filteredTasks]);

  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 pb-4">
      <section
        className="rounded-2xl border border-white/10 p-4 sm:p-5 lg:p-6"
        style={{
          background: 'linear-gradient(160deg, rgba(16, 34, 79, 0.92), rgba(12, 24, 58, 0.84))',
          boxShadow: '0 16px 48px rgba(0,0,0,0.28)'
        }}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-white/60">Implementation / Task</p>
            <h1 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">Task Command Center</h1>
            <p className="mt-1 text-sm text-white/70">Manage team tasks, status flow, and deadline pressure in one operational board.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Export
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-white transition hover:brightness-110"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #22C55E)' }}
            >
              + New Task
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search task, assignee, program..."
            className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-blue-400/70"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | TaskStatus)}
            className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-blue-400/70"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as 'all' | TaskPriority)}
            className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-blue-400/70"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Tasks', value: summary.total, accent: '#3B82F6' },
          { label: 'Completed', value: summary.completed, accent: '#22C55E' },
          { label: 'Overdue', value: summary.overdue, accent: '#EF4444' },
          { label: 'Average Progress', value: `${summary.avgProgress}%`, accent: '#F59E0B' }
        ].map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-white/10 p-4"
            style={{
              background: 'linear-gradient(155deg, rgba(20, 42, 95, 0.85), rgba(18, 28, 57, 0.78))',
              boxShadow: '0 8px 26px rgba(0,0,0,0.2)'
            }}
          >
            <p className="text-xs uppercase tracking-[0.08em] text-white/65">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{card.value}</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
              <div className="h-1.5 rounded-full" style={{ width: '72%', background: card.accent }} />
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.85fr_1fr]">
        <article
          className="rounded-2xl border border-white/10 p-4"
          style={{
            background: 'linear-gradient(160deg, rgba(19, 40, 88, 0.85), rgba(16, 26, 56, 0.78))',
            boxShadow: '0 10px 32px rgba(0,0,0,0.25)'
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Task Pipeline</h2>
            <span className="text-xs text-white/65">{filteredTasks.length} visible tasks</span>
          </div>
          <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
            {(Object.keys(STATUS_META) as TaskStatus[]).map((status) => (
              <div key={status} className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{STATUS_META[status].label}</p>
                  <span
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold"
                    style={{ background: STATUS_META[status].chip, color: '#FFFFFF' }}
                  >
                    {groupedTasks[status].length}
                  </span>
                </div>

                <div className="space-y-2">
                  {groupedTasks[status].map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border border-white/10 p-2.5"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <p className="text-sm font-medium text-white">{task.title}</p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-white/65">
                        <span>{task.id}</span>
                        <span>{task.assignee}</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${task.progress}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px]">
                        <span className="text-white/75">{task.program}</span>
                        <span style={{ color: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="space-y-4">
          <article
            className="rounded-2xl border border-white/10 p-4"
            style={{
              background: 'linear-gradient(160deg, rgba(20, 40, 85, 0.84), rgba(16, 26, 53, 0.76))',
              boxShadow: '0 10px 30px rgba(0,0,0,0.22)'
            }}
          >
            <h2 className="text-base font-semibold text-white">Team Workload</h2>
            <div className="mt-3 space-y-3">
              {workload.map((member) => (
                <div key={member.assignee}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{member.assignee}</span>
                    <span className="text-white/65">{member.total} tasks</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                      style={{ width: `${member.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article
            className="rounded-2xl border border-white/10 p-4"
            style={{
              background: 'linear-gradient(160deg, rgba(20, 40, 85, 0.84), rgba(16, 26, 53, 0.76))',
              boxShadow: '0 10px 30px rgba(0,0,0,0.22)'
            }}
          >
            <h2 className="text-base font-semibold text-white">Upcoming Deadlines</h2>
            <div className="mt-3 space-y-2">
              {filteredTasks
                .filter((task) => task.status !== 'done')
                .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime())
                .slice(0, 5)
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-white/10 px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <p className="truncate text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-white/65">
                      Due {task.dueDate} · {task.program}
                    </p>
                  </div>
                ))}
            </div>
          </article>
        </div>
      </section>

      <section
        className="rounded-2xl border border-white/10 p-4"
        style={{
          background: 'linear-gradient(160deg, rgba(16, 34, 79, 0.88), rgba(14, 24, 52, 0.79))',
          boxShadow: '0 10px 30px rgba(0,0,0,0.24)'
        }}
      >
        <h2 className="text-lg font-semibold text-white">All Tasks</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.08em] text-white/55">
                <th className="px-3 py-1">Task</th>
                <th className="px-3 py-1">Program</th>
                <th className="px-3 py-1">Assignee</th>
                <th className="px-3 py-1">Status</th>
                <th className="px-3 py-1">Priority</th>
                <th className="px-3 py-1">Due Date</th>
                <th className="px-3 py-1">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="rounded-xl border border-white/10 bg-white/[0.03]">
                  <td className="rounded-l-xl px-3 py-3 text-sm text-white">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-white/55">{task.id}</p>
                  </td>
                  <td className="px-3 py-3 text-sm text-white/80">{task.program}</td>
                  <td className="px-3 py-3 text-sm text-white/80">{task.assignee}</td>
                  <td className="px-3 py-3 text-xs text-white">
                    <span
                      className="inline-flex rounded-full px-2 py-1 font-semibold"
                      style={{ background: STATUS_META[task.status].chip }}
                    >
                      {STATUS_META[task.status].label}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold" style={{ color: PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                  </td>
                  <td className="px-3 py-3 text-sm text-white/80">{task.dueDate}</td>
                  <td className="rounded-r-xl px-3 py-3 text-sm text-white">
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${task.progress}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-white/60">{task.progress}%</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TaskPage;
