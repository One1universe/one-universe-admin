import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface PermissionState {
  [action: string]: {
    [role: string]: boolean;
  };
}

const PermissionsTable = () => {
  const roles = ['Admin', 'User Manager', 'Content Manager', 'Support Staff'];
  
  const actions = [
    'Dashboard',
    'User Management',
    'Payment Management',
    'Dispute',
    'Service Management',
    'Promotional Offers',
    'Support & Feedback',
  ];

  const permissions = ['View', 'Manage', 'Delete', 'Export'];

  const [permissionState, setPermissionState] = useState<PermissionState>(() => {
    const initialState: PermissionState = {};
    actions.forEach((action) => {
      initialState[action] = {};
      roles.forEach((role) => {
        initialState[action][role] = role === 'Admin';
      });
    });
    return initialState;
  });

  const togglePermission = (action: string, role: string) => {
    setPermissionState((prev) => ({
      ...prev,
      [action]: {
        ...prev[action],
        [role]: !prev[action][role],
      },
    }));
  };

  const toggleAllForRole = (role: string) => {
    const allEnabled = actions.every((action) => permissionState[action][role]);
    const newState: PermissionState = {};
    actions.forEach((action) => {
      newState[action] = {
        ...permissionState[action],
        [role]: !allEnabled,
      };
    });
    setPermissionState(newState);
  };

  return (
    <div className="w-full bg-white rounded-lg overflow-hidden">
      {/* Header Row */}
      <div className="flex border-b border-[#EAECF0]">
        {/* Actions Column Header */}
        <div className="w-48 bg-[#FFFCFC] border-r border-[#EAECF0]">
          <div className="h-16 px-6 py-4 flex items-center border-b border-[#EAECF0]">
            <span className="font-dm-sans font-medium text-base text-[#121212]">
              Action
            </span>
          </div>
        </div>

        {/* Role Headers */}
        {roles.map((role) => (
          <div
            key={role}
            className="flex-1 bg-[#FFFCFC] border-r border-[#EAECF0] last:border-r-0"
          >
            <div className="h-16 px-6 py-4 flex flex-col items-center justify-between gap-2 border-b border-[#EAECF0]">
              <span className="font-dm-sans font-medium text-base text-[#121212]">
                {role}
              </span>
              <button
                onClick={() => toggleAllForRole(role)}
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 transition"
                title="Enable/Disable all permissions for this role"
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    actions.every((action) => permissionState[action][role])
                      ? 'bg-[#154751] border-[#154751]'
                      : 'border-[#B2B2B4] bg-white'
                  }`}
                >
                  {actions.every((action) => permissionState[action][role]) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-dm-sans font-medium text-sm text-[#171417]">
                  Enable All
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Body Rows */}
      {actions.map((action, actionIndex) => (
        <div key={action} className="flex border-b border-[#EAECF0] last:border-b-0">
          {/* Action Name */}
          <div className="w-48 bg-white border-r border-[#EAECF0]">
            <div className="h-20 px-6 py-4 flex items-center">
              <span className="font-dm-sans font-medium text-base text-[#171417]">
                {action}
              </span>
            </div>
          </div>

          {/* Permission Cells */}
          {roles.map((role) => (
            <div
              key={`${action}-${role}`}
              className="flex-1 bg-white border-r border-[#EAECF0] last:border-r-0"
            >
              <div className="h-20 flex">
                {permissions.map((permission, permIndex) => (
                  <div
                    key={permission}
                    className={`flex-1 flex items-center justify-center border-r border-[#EAECF0] last:border-r-0 hover:bg-gray-50 transition cursor-pointer ${
                      permIndex === permissions.length - 1 ? 'border-r-0' : ''
                    }`}
                    onClick={() => togglePermission(action, role)}
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                        permissionState[action][role]
                          ? 'bg-[#154751] border-[#154751]'
                          : 'border-[#B2B2B4] bg-white'
                      }`}
                    >
                      {permissionState[action][role] && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Footer Note */}
      <div className="bg-[#F8F9FA] px-6 py-4 border-t border-[#EAECF0]">
        <p className="font-dm-sans text-sm text-[#949394]">
          This permission management interface allows you to control access levels for different admin roles across various system actions.
        </p>
      </div>
    </div>
  );
};

export default PermissionsTable;