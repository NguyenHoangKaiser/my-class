import * as React from "react";
import Icon from "@ant-design/icons";
import type { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M21.973 17.031v-6.23l.18-.106a1.2 1.2 0 0 0 .6-1.043 1.2 1.2 0 0 0-.6-1.047L13.034 3.31a2.484 2.484 0 0 0-2.488 0L1.426 8.605a1.21 1.21 0 0 0 0 2.094l2.765 1.606v3.734c0 .867.465 1.672 1.215 2.106l3.809 2.195a5.157 5.157 0 0 0 2.574.687c.89 0 1.781-.23 2.578-.687l3.805-2.195a2.436 2.436 0 0 0 1.215-2.106v-3.734l1.238-.72v5.446a1.198 1.198 0 0 0 .676 2.192c.66 0 1.199-.54 1.199-1.2 0-.414-.207-.777-.527-.992Zm-3.934-.992c0 .383-.207.742-.543.934l-3.805 2.195a3.824 3.824 0 0 1-3.804 0l-3.805-2.195a1.083 1.083 0 0 1-.539-.934v-2.95l5.004 2.907c.383.223.812.332 1.242.332.43 0 .863-.11 1.246-.332l5.004-2.906Zm-5.684-1.21a1.13 1.13 0 0 1-1.132 0l-8.91-5.177 8.91-5.175a1.13 1.13 0 0 1 1.132 0l8.91 5.175Zm0 0" />
  </svg>
);

const ClassIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={SvgComponent} {...props} />
);

export default ClassIcon;
