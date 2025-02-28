import React, { useState } from 'react';
import { Btn } from '@/components/ui/button';
import SideDrawer from './side-drawer';

export function DrawerExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Btn.Primary onClick={() => setOpen(true)}>
        Open Drawer
      </Btn.Primary>
      
      <SideDrawer 
        open={open} 
        setOpen={setOpen}
        title="Example Drawer"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Drawer Content</h3>
          <p>This is an example of the side drawer component.</p>
          <p>The drawer slides in from the right side of the screen.</p>
          <p>On tablet devices, it takes up to 80% of the viewport width (capped at the specified width).</p>
          <p>You can close this drawer by:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Clicking the X button</li>
            <li>Clicking outside the drawer</li>
            <li>Pressing the Escape key</li>
          </ul>
        </div>
      </SideDrawer>
    </>
  );
}
