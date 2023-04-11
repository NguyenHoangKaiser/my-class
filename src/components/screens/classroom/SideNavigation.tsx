import React from "react";
import { atom, useAtom } from "jotai";
import {
  PaperCheckIcon,
  PeopleIcon,
  PencilSquare,
} from "src/components/common/Icons";
import Roles from "src/utils/constants";
import { useSession } from "src/hooks";
import { Tabs } from "antd";

export const tabAtom = atom("assignments");

const studentLinks = [
  {
    name: "Assignments",
    tab: "assignments",
    icon: <PaperCheckIcon />,
  },
  {
    name: "Students",
    tab: "students",
    icon: <PeopleIcon />,
  },
];

const teacherLinks = [
  {
    name: "Assignments",
    tab: "assignments",
    icon: <PaperCheckIcon />,
  },
  {
    name: "Students",
    tab: "students",
    icon: <PeopleIcon />,
  },
  {
    name: "Submissions",
    tab: "submissions",
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
    <aside className="w-52 flex-none" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3">
        <Tabs
          tabPosition="left"
          activeKey={selectedTab}
          onChange={(key) => setSelectedTab(key)}
          items={links.map((link) => ({
            key: link.tab,
            label: (
              <div className="flex items-center gap-1">
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </div>
            ),
          }))}
        />
      </div>
    </aside>
  );
}

export default SideNavigation;
