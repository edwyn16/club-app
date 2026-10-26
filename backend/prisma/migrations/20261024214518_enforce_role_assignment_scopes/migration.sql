-- Ensure club assignments reference CLUB-scoped roles.
CREATE OR REPLACE FUNCTION enforce_club_role_scope()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM roles
    WHERE id = NEW.role_id
      AND scope = 'CLUB'
      AND deleted_at IS NULL
      AND is_active = TRUE
  ) THEN
    RAISE EXCEPTION
      'Club role assignments require an active CLUB-scoped role';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_club_role_scope
BEFORE INSERT OR UPDATE OF role_id
ON user_club_roles
FOR EACH ROW
EXECUTE FUNCTION enforce_club_role_scope();


-- Ensure platform assignments reference PLATFORM-scoped roles.
CREATE OR REPLACE FUNCTION enforce_platform_role_scope()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM roles
    WHERE id = NEW.role_id
      AND scope = 'PLATFORM'
      AND deleted_at IS NULL
      AND is_active = TRUE
  ) THEN
    RAISE EXCEPTION
      'Platform role assignments require an active PLATFORM-scoped role';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_platform_role_scope
BEFORE INSERT OR UPDATE OF role_id
ON user_platform_roles
FOR EACH ROW
EXECUTE FUNCTION enforce_platform_role_scope();