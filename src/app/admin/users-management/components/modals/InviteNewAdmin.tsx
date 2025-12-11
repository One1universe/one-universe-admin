import React, { useState } from 'react';
import { X, ChevronDown, UserPlus, Settings, Check } from 'lucide-react';

interface InviteNewAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (adminData: any) => void;
}

interface PermissionState {
  [action: string]: {
    view: boolean;
    manage: boolean;
    delete: boolean;
    export: boolean;
  };
}

const InviteNewAdmin: React.FC<InviteNewAdminProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'permissions'>('profile');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const predefinedRoles = ['Admin', 'User Manager', 'Content Manager', 'Support Staff'];

  const actions = [
    'Dashboard',
    'User Management',
    'Payment Management',
    'Dispute',
    'Service Management',
    'Promotional Offers',
    'Support & Feedback',
  ];

  const permissionTypes = ['view', 'manage', 'delete', 'export'];

  const [permissionState, setPermissionState] = useState<PermissionState>(() => {
    const initialState: PermissionState = {};
    actions.forEach((action) => {
      initialState[action] = {
        view: true,
        manage: false,
        delete: false,
        export: false,
      };
    });
    return initialState;
  });

  const hasAnyPermission = actions.some((action) =>
    permissionTypes.some((perm) => permissionState[action][perm as keyof PermissionState[keyof PermissionState]])
  );

  const isFormValid = fullName.trim() !== '' && email.trim() !== '' && selectedRole !== '' && (activeTab === 'profile' || hasAnyPermission);

  const togglePermission = (action: string, permission: string) => {
    setPermissionState((prev) => ({
      ...prev,
      [action]: {
        ...prev[action],
        [permission]: !prev[action][permission as keyof PermissionState[keyof PermissionState]],
      },
    }));
  };

  const toggleAllPermissions = () => {
    const allEnabled = actions.every((action) =>
      permissionTypes.every((perm) => permissionState[action][perm as keyof PermissionState[keyof PermissionState]])
    );
    
    const newState: PermissionState = {};
    actions.forEach((action) => {
      newState[action] = {
        view: !allEnabled,
        manage: !allEnabled,
        delete: !allEnabled,
        export: !allEnabled,
      };
    });
    setPermissionState(newState);
  };

  const handleProceed = () => {
    if (isFormValid && onInvite) {
      onInvite({
        fullName,
        email,
        role: selectedRole,
        permissions: permissionState,
      });
      // Reset form
      setFullName('');
      setEmail('');
      setSelectedRole('');
      setActiveTab('profile');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[80]" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[90] flex items-start md:items-center justify-center pt-4 md:pt-0 px-0 md:px-4 pb-0 md:pb-4 overflow-y-auto"
        style={{ contain: "none" }}
      >
        <div
          className="w-full md:max-w-[603px] bg-white md:rounded-2xl rounded-t-2xl shadow-[-1px_8px_12px_0px_#0000001F] overflow-visible min-h-[calc(100vh-16px)] md:min-h-0 md:max-h-[90vh] overflow-y-auto"
          style={{ transform: "translateZ(0)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Teal Header */}
          <div className="bg-[#E8FBF7] px-4 md:px-8 pt-8 pb-4 border-b border-[#E8E3E3] sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h2 className="font-dm-sans font-bold text-[20px] leading-[140%] text-[#171417]">
                Invite New Admin
              </h2>
              <button
                onClick={onClose}
                className="p-0 hover:opacity-70 transition"
              >
                <X className="w-6 h-6 text-[#171417]" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 md:px-8 py-0 flex items-center gap-3 md:gap-5 overflow-x-auto sticky top-[88px] bg-white z-10 border-b border-[#E8E3E3]">
            {/* Profile Information Tab */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-1 py-1 border-b-2 transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'profile'
                  ? 'border-[#454345]'
                  : 'border-[#949394]'
              }`}
            >
              <UserPlus 
                size={16} 
                className={`flex-shrink-0 ${activeTab === 'profile' ? 'text-[#171417]' : 'text-[#949394]'}`}
              />
              <span
                className={`font-dm-sans text-sm md:text-base leading-[140%] ${
                  activeTab === 'profile' ? 'text-[#171417]' : 'text-[#949394]'
                }`}
              >
                Profile Information
              </span>
            </button>

            {/* Permission Management Tab */}
            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-1 py-1 border-b-2 transition whitespace-nowrap flex-shrink-0 ${
                activeTab === 'permissions'
                  ? 'border-[#454345]'
                  : 'border-[#949394]'
              }`}
            >
              <Settings 
                size={16} 
                className={`flex-shrink-0 ${activeTab === 'permissions' ? 'text-[#171417]' : 'text-[#949394]'}`}
              />
              <span
                className={`font-dm-sans text-sm md:text-base leading-[140%] ${
                  activeTab === 'permissions' ? 'text-[#171417]' : 'text-[#949394]'
                }`}
              >
                Permission Management
              </span>
            </button>
          </div>

          {/* Content */}
          <div className="px-4 md:px-8 py-5 flex flex-col gap-5">
            {activeTab === 'profile' ? (
              <>
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your admin first and last name"
                    className="w-full h-[46px] rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B2B2B4] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Admin Email */}
                <div className="flex flex-col gap-2">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your admin email"
                    className="w-full h-[46px] rounded-xl border border-[#B2B2B4] px-4 py-3 font-dm-sans text-base text-[#171417] placeholder:text-[#B2B2B4] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Select Role */}
                <div className="flex flex-col gap-2">
                  <label className="font-dm-sans font-medium text-base text-[#05060D]">
                    Select Role
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      className={`w-full h-[43px] rounded-xl px-4 py-3 flex items-center justify-between font-dm-sans text-base focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        selectedRole
                          ? 'border text-[#454345]'
                          : 'border border-[#B2B2B4] text-[#B2B2B4]'
                      }`}
                      style={
                        selectedRole
                          ? {
                              borderWidth: '1px',
                              borderStyle: 'solid',
                              borderImage: 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%) 1',
                            }
                          : {}
                      }
                    >
                      <span className="truncate text-left">{selectedRole || 'Choose from predefined or custom roles'}</span>
                      <ChevronDown className="w-5 h-5 text-[#171417] flex-shrink-0 ml-2" />
                    </button>

                    {/* Dropdown */}
                    {isRoleDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_#1A1A1A1F,0px_4px_6px_0px_#1A1A1A14,0px_8px_16px_0px_#1A1A1A14] overflow-hidden z-[100]">
                        {predefinedRoles.map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              setSelectedRole(role);
                              setIsRoleDropdownOpen(false);
                            }}
                            className="w-full px-2 py-2 flex items-center gap-3 hover:bg-gray-50 transition border-b border-[#E5E5E5] last:border-b-0"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                selectedRole === role
                                  ? 'bg-[#E6E6E6] border-[#154751]'
                                  : 'bg-white border-[#757575]'
                              }`}
                            >
                              {selectedRole === role && (
                                <div className="w-2 h-2 rounded-full bg-[#154751]" />
                              )}
                            </div>
                            <span className="font-dm-sans text-base text-[#3C3C3C]">
                              {role}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Permissions Table */}
                <div className="w-full bg-white rounded-lg overflow-hidden border border-[#EAECF0]">
                  {/* Header Row */}
                  <div className="flex border-b border-[#EAECF0] bg-[#FFFCFC]">
                    {/* Action Column */}
                    <div className="w-48 px-6 py-4 border-r border-[#EAECF0]">
                      <span className="font-dm-sans font-medium text-base text-[#171417]">
                        Action
                      </span>
                    </div>

                    {/* Admin Role Section */}
                    <div className="flex-1">
                      <div className="flex h-full border-r border-[#EAECF0]">
                        {/* Admin Role Name */}
                        <div className="w-32 px-4 py-4 border-r border-[#EAECF0] flex items-center justify-center">
                          <span className="font-dm-sans font-medium text-base text-[#171417]">
                            Admin
                          </span>
                        </div>

                        {/* Enable All Button */}
                        <div className="flex-1 px-4 py-4 flex items-center justify-center">
                          <button
                            onClick={toggleAllPermissions}
                            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
                            title="Enable/Disable all permissions"
                          >
                            <div
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                actions.every((action) =>
                                  permissionTypes.every((perm) => permissionState[action][perm as keyof PermissionState[keyof PermissionState]])
                                )
                                  ? 'bg-[#154751] border-[#154751]'
                                  : 'border-[#B2B2B4] bg-white'
                              }`}
                            >
                              {actions.every((action) =>
                                permissionTypes.every((perm) => permissionState[action][perm as keyof PermissionState[keyof PermissionState]])
                              ) && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="font-dm-sans font-medium text-base text-[#171417]">
                              Enable All
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub-header with permission types */}
                  <div className="flex border-b border-[#EAECF0] bg-[#FFFCFC]">
                    {/* Action Column */}
                    <div className="w-48 px-6 py-3 border-r border-[#EAECF0]">
                      {/* Empty space matching action column */}
                    </div>

                    {/* Permission Types */}
                    <div className="flex flex-1 border-r border-[#EAECF0]">
                      {['View', 'Manage', 'Delete', 'Export'].map((perm) => (
                        <div
                          key={perm}
                          className="flex-1 px-4 py-3 border-r border-[#EAECF0] last:border-r-0 flex items-center justify-center"
                        >
                          <span className="font-dm-sans font-medium text-base text-[#171417]">
                            {perm}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body Rows */}
                  {actions.map((action) => (
                    <div key={action} className="flex border-b border-[#EAECF0] last:border-b-0">
                      {/* Action Name */}
                      <div className="w-48 px-6 py-4 border-r border-[#EAECF0] flex items-center bg-white">
                        <span className="font-dm-sans font-medium text-base text-[#171417]">
                          {action}
                        </span>
                      </div>

                      {/* Permission Cell */}
                      <div className="flex-1 bg-white border-r border-[#EAECF0]">
                        <div className="flex h-full">
                          {permissionTypes.map((perm, idx) => (
                            <div
                              key={perm}
                              className={`flex-1 flex items-center justify-center border-r border-[#EAECF0] last:border-r-0 hover:bg-gray-50 transition cursor-pointer ${
                                idx < 3 ? 'border-r' : ''
                              }`}
                              onClick={() => togglePermission(action, perm)}
                            >
                              <div
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                                  permissionState[action][perm as keyof PermissionState[keyof PermissionState]]
                                    ? 'bg-[#154751] border-[#154751]'
                                    : 'border-[#B2B2B4] bg-white'
                                }`}
                              >
                                {permissionState[action][perm as keyof PermissionState[keyof PermissionState]] && (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Note */}
                <div className="bg-[#F8F9FA] px-4 py-3 rounded-lg border border-[#EAECF0]">
                  <p className="font-dm-sans text-sm text-[#949394]">
                    Configure permissions for the {selectedRole || 'selected role'} across different actions.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Button */}
          <div className="px-4 md:px-8 pb-5 sticky bottom-0 bg-white border-t border-[#E8E3E3] pt-5">
            <button
              onClick={handleProceed}
              disabled={!isFormValid}
              className="w-full h-10 rounded-full font-dm-sans font-medium text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isFormValid
                  ? 'radial-gradient(50% 50% at 50% 50%, #154751 37%, #04171F 100%)'
                  : 'linear-gradient(0deg, #ACC5CF, #ACC5CF)',
              }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteNewAdmin;