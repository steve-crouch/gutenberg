import { Course, Section, Theme } from 'lib/material';
import React, { memo } from 'react';
import { Handle, Position, Node } from 'reactflow';
import { NodeData } from './NavDiagram';

type NodeProps = {
  data: NodeData,
}

function NavDiagramCourseNode({ data }: NodeProps) {
  console.log(data)
  return (
    <a href={`/material/${data.theme}/${data.course?.id}`} >
    <div className={`px-4 py-2 h-full w-full border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600`}>
      <div className="flex">
        <div className="ml-2">
          <div className="mb-2 text-2xl font-extrabold">{data.label}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
    </a>
  );
}

export default memo(NavDiagramCourseNode);