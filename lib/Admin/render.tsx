import { UserRole } from "@enum/userRolesEnum";
import {
  faIdBadge,
  faCameraRetro,
  faHammer,
} from "@node_modules/@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@node_modules/@fortawesome/react-fontawesome";

const rolePriority = {
  [UserRole.ADMIN]: 0,
  [UserRole.CREATOR]: 1,
  [UserRole.USER]: 2,
};

export const renderRole = (roles: UserRole[]) => {
  return (
    <>
      {roles
        ?.sort((a, b) => rolePriority[a] - rolePriority[b])
        .map((r) => (
          <FontAwesomeIcon
            key={r}
            icon={
              r === UserRole.USER
                ? faIdBadge
                : r === UserRole.CREATOR
                ? faCameraRetro
                : r === UserRole.ADMIN
                ? faHammer
                : faIdBadge
            }
            title={r}
          />
        ))}{" "}
    </>
  );
};
