import React, { memo } from "react";
import usePfp from "../../hooks/usePfp";
import UserDefaultPfp from "./user.svg";
import WorkspaceDefaultPfp from "./workspace.svg";
import brandLogo from '../../media/logo/brantas.png';

const UserIcon = memo(({ role }) => {
  const { pfp } = usePfp();

  return (
    <div className="relative w-[35px] h-[35px] rounded-full overflow-hidden flex items-center justify-center rounded-full bg-white border">
      {role === "user" && <RenderUserPfp pfp={pfp} />}
      {role !== "user" && (
        <img
          src={brandLogo}
          alt="Workspace profile picture"
          className="w-[20px] h-[20px] object-content"
        />
      )}
    </div>
  );
});

function RenderUserPfp({ pfp }) {
  if (!pfp)
    return (
      <img
        src={UserDefaultPfp}
        alt="User profile picture"
        className="rounded-full border-none"
      />
    );

  return (
    <img
      src={pfp}
      alt="User profile picture"
      className="absolute top-0 left-0 w-full h-full object-cover rounded-full border-none"
    />
  );
}

export default UserIcon;
