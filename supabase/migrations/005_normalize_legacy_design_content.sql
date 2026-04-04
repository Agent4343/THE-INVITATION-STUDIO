-- Backfill legacy design content so older records render new event-first wording.
-- This is safe to run multiple times because it only updates known legacy values.

UPDATE designs
SET
  content =
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    jsonb_set(
                      jsonb_set(
                        content,
                        '{preHeading}',
                        CASE
                          WHEN lower(trim(coalesce(content->>'preHeading', ''))) IN ('together with their families', 'hosted by their loved ones')
                            THEN to_jsonb('Hosted by friends and family'::text)
                          ELSE to_jsonb(coalesce(content->>'preHeading', '')::text)
                        END,
                        true
                      ),
                      '{invitationLine}',
                      CASE
                        WHEN lower(trim(coalesce(content->>'invitationLine', ''))) = 'invite you to celebrate their marriage'
                          THEN to_jsonb('invite you to celebrate with us'::text)
                        ELSE to_jsonb(coalesce(content->>'invitationLine', '')::text)
                      END,
                      true
                    ),
                    '{welcomeMessage}',
                    CASE
                      WHEN lower(trim(coalesce(content->>'welcomeMessage', ''))) = 'welcome to our wedding'
                        THEN to_jsonb('Welcome to Our Celebration'::text)
                      ELSE to_jsonb(coalesce(content->>'welcomeMessage', '')::text)
                    END,
                    true
                  ),
                  '{name1}',
                  CASE
                    WHEN lower(trim(coalesce(content->>'name1', ''))) IN ('emma rose', 'name one', 'host name')
                      THEN to_jsonb(''::text)
                    ELSE to_jsonb(coalesce(content->>'name1', '')::text)
                  END,
                  true
                ),
                '{name2}',
                CASE
                  WHEN lower(trim(coalesce(content->>'name2', ''))) IN ('james william', 'name two', 'co-host name')
                    THEN to_jsonb(''::text)
                  ELSE to_jsonb(coalesce(content->>'name2', '')::text)
                END,
                true
              ),
              '{venue}',
              CASE
                WHEN lower(trim(coalesce(content->>'venue', ''))) IN ('the grand estate', 'your event venue')
                  THEN to_jsonb(''::text)
                ELSE to_jsonb(coalesce(content->>'venue', '')::text)
              END,
              true
            ),
            '{address}',
            CASE
              WHEN lower(trim(coalesce(content->>'address', ''))) IN ('123 garden lane, napa valley, california', 'your event location', 'your event address')
                THEN to_jsonb(''::text)
              ELSE to_jsonb(coalesce(content->>'address', '')::text)
            END,
            true
          ),
          '{time}',
          CASE
            WHEN lower(trim(coalesce(content->>'time', ''))) IN ('half past four in the afternoon', 'your event time')
              THEN to_jsonb(''::text)
            ELSE to_jsonb(coalesce(content->>'time', '')::text)
          END,
          true
        ),
        '{date}',
        CASE
          WHEN lower(trim(coalesce(content->>'date', ''))) = 'your event date'
            THEN to_jsonb(''::text)
          ELSE to_jsonb(coalesce(content->>'date', '')::text)
        END,
        true
      ),
      '{eventType}',
      CASE
        WHEN trim(coalesce(content->>'eventType', '')) = ''
          THEN to_jsonb('celebration'::text)
        ELSE to_jsonb((content->>'eventType')::text)
      END,
      true
    ),
  updated_at = NOW()
WHERE
  lower(trim(coalesce(content->>'preHeading', ''))) IN ('together with their families', 'hosted by their loved ones')
  OR lower(trim(coalesce(content->>'invitationLine', ''))) = 'invite you to celebrate their marriage'
  OR lower(trim(coalesce(content->>'welcomeMessage', ''))) = 'welcome to our wedding'
  OR lower(trim(coalesce(content->>'name1', ''))) IN ('emma rose', 'name one', 'host name')
  OR lower(trim(coalesce(content->>'name2', ''))) IN ('james william', 'name two', 'co-host name')
  OR lower(trim(coalesce(content->>'venue', ''))) IN ('the grand estate', 'your event venue')
  OR lower(trim(coalesce(content->>'address', ''))) IN ('123 garden lane, napa valley, california', 'your event location', 'your event address')
  OR lower(trim(coalesce(content->>'time', ''))) IN ('half past four in the afternoon', 'your event time')
  OR lower(trim(coalesce(content->>'date', ''))) = 'your event date'
  OR trim(coalesce(content->>'eventType', '')) = '';
