import classNames from "classnames";
import React from "react";
import { atom, useAtom } from "jotai";
import {
  PaperCheckIcon,
  PeopleIcon,
  PencilSquare,
} from "src/components/common/Icons";
import Roles from "src/utils/constants";
import { useSession } from "src/hooks";

export enum TabName {
  Assignment,
  Students,
  Submissions,
}

export const tabAtom = atom<TabName>(TabName.Assignment);

const studentLinks = [
  {
    name: "Assignments",
    tab: TabName.Assignment,
    icon: <PaperCheckIcon />,
  },
  {
    name: "Students",
    tab: TabName.Students,
    icon: <PeopleIcon />,
  },
];

const teacherLinks = [
  {
    name: "Assignments",
    tab: TabName.Assignment,
    icon: <PaperCheckIcon />,
  },
  {
    name: "Students",
    tab: TabName.Students,
    icon: <PeopleIcon />,
  },
  {
    name: "Submissions",
    tab: TabName.Submissions,
    icon: <PencilSquare />,
  },
];

function SideNavigation() {
  const [selectedTab, setSelectedTab] = useAtom(tabAtom);
  const session = useSession();

  if (!session.data) return null;

  const links =
    session.data.user?.role === Roles.Teacher ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 flex-none" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3">
        <ul className="space-y-2 rounded-xl bg-gray-100 dark:bg-gray-700">
          {links.map((link) => (
            <li key={link.name} onClick={() => setSelectedTab(link.tab)}>
              <a
                href="#"
                className={classNames(
                  "flex items-center rounded-lg p-2 text-base font-normal ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  link.tab === selectedTab
                    ? "bg-primary-200 text-primary-700 shadow "
                    : "text-blue-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-blue-400"
                )}
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default SideNavigation;
