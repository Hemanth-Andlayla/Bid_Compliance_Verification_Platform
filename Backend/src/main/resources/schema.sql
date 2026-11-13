-- =========================================================
-- Bid Compliance Verification Platform
-- Database Schema
-- MySQL 8.4
-- =========================================================


-- =========================================================
-- 1. USERS
-- Application-level user profile.
-- Authentication and roles are handled by Keycloak.
-- =========================================================

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,

                       keycloak_user_id VARCHAR(255) NOT NULL,
                       name VARCHAR(150) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       organization VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

                       CONSTRAINT uq_users_keycloak_user_id
                           UNIQUE (keycloak_user_id),

                       CONSTRAINT uq_users_email
                           UNIQUE (email)
);


-- =========================================================
-- 2. TENDERS
-- Created by an officer.
-- =========================================================

CREATE TABLE tenders (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY,

                         title VARCHAR(255) NOT NULL,
                         description TEXT,

                         created_by BIGINT NOT NULL,
                         organization VARCHAR(255) NOT NULL,
                         submission_deadline TIMESTAMP NOT NULL,

                         status VARCHAR(30) NOT NULL,

                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,

                         CONSTRAINT fk_tenders_created_by
                             FOREIGN KEY (created_by)
                                 REFERENCES users(id)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE
);


ALTER TABLE users
    ADD COLUMN organization VARCHAR(255) NOT NULL;

ALTER TABLE tenders
    ADD COLUMN organization VARCHAR(255) NOT NULL;

-- =========================================================
-- 3. TENDER REQUIREMENTS
-- Documents/details required for a particular tender.
-- =========================================================

CREATE TABLE tender_requirements (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                     tender_id BIGINT NOT NULL,

                                     requirement_type VARCHAR(50) NOT NULL,
                                     description TEXT,

                                     mandatory BOOLEAN NOT NULL DEFAULT TRUE,

                                     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                     CONSTRAINT fk_requirements_tender
                                         FOREIGN KEY (tender_id)
                                             REFERENCES tenders(id)
                                             ON DELETE RESTRICT
                                             ON UPDATE CASCADE,

                                     INDEX idx_requirements_tender_id (tender_id)
);


-- =========================================================
-- 4. BIDS
-- A bidder submits a bid against a tender.
-- =========================================================

CREATE TABLE bids (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,

                      tender_id BIGINT NOT NULL,
                      bidder_id BIGINT NOT NULL,

                      quoted_price DECIMAL(15,2),

                      status VARCHAR(30) NOT NULL,

                      submitted_at TIMESTAMP NULL,
                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,

                      CONSTRAINT fk_bids_tender
                          FOREIGN KEY (tender_id)
                              REFERENCES tenders(id)
                              ON DELETE RESTRICT
                              ON UPDATE CASCADE,

                      CONSTRAINT fk_bids_bidder
                          FOREIGN KEY (bidder_id)
                              REFERENCES users(id)
                              ON DELETE RESTRICT
                              ON UPDATE CASCADE,

                      INDEX idx_bids_tender_id (tender_id),
                      INDEX idx_bids_bidder_id (bidder_id)
);


-- =========================================================
-- 5. BIDDER DETAILS
-- Details declared by the bidder for this particular bid.
-- =========================================================

CREATE TABLE bidder_details (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                bid_id BIGINT NOT NULL,

                                name VARCHAR(255) NOT NULL,
                                pan VARCHAR(20),
                                gstin VARCHAR(20),
                                udyam_number VARCHAR(50),
                                address TEXT,

                                CONSTRAINT uq_bidder_details_bid
                                    UNIQUE (bid_id),

                                CONSTRAINT fk_bidder_details_bid
                                    FOREIGN KEY (bid_id)
                                        REFERENCES bids(id)
                                        ON DELETE RESTRICT
                                        ON UPDATE CASCADE
);


-- =========================================================
-- 6. DOCUMENTS
-- Metadata/reference for uploaded documents.
-- Actual files are stored outside MySQL.
--
-- Multiple records of the same document_type are allowed
-- to preserve re-upload history.
-- =========================================================

CREATE TABLE documents (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,

                           bid_id BIGINT NOT NULL,

                           document_type VARCHAR(50) NOT NULL,

                           file_name VARCHAR(255) NOT NULL,
                           file_path VARCHAR(1000) NOT NULL,

                           file_size BIGINT,
                           mime_type VARCHAR(100),

                           uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_documents_bid
                               FOREIGN KEY (bid_id)
                                   REFERENCES bids(id)
                                   ON DELETE RESTRICT
                                   ON UPDATE CASCADE,

                           INDEX idx_documents_bid_id (bid_id)
);


-- =========================================================
-- 7. DOCUMENT EXTRACTIONS
-- Stores structured information extracted from documents.
--
-- Multiple records allow re-processing/history.
-- =========================================================

CREATE TABLE document_extractions (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                      document_id BIGINT NOT NULL,

                                      extracted_fields JSON,

                                      extraction_status VARCHAR(30) NOT NULL,

                                      extracted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                      CONSTRAINT fk_extractions_document
                                          FOREIGN KEY (document_id)
                                              REFERENCES documents(id)
                                              ON DELETE CASCADE
                                              ON UPDATE CASCADE,

                                      INDEX idx_extractions_document_id (document_id)
);


-- =========================================================
-- 8. COMPLIANCE RESULTS
-- Checks whether the bid satisfies tender requirements.
-- =========================================================

CREATE TABLE compliance_results (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                    bid_id BIGINT NOT NULL,
                                    requirement_id BIGINT NOT NULL,

                                    document_id BIGINT NULL,

                                    status VARCHAR(30) NOT NULL,
                                    reason TEXT,

                                    checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_compliance_bid
                                        FOREIGN KEY (bid_id)
                                            REFERENCES bids(id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,

                                    CONSTRAINT fk_compliance_requirement
                                        FOREIGN KEY (requirement_id)
                                            REFERENCES tender_requirements(id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,

                                    CONSTRAINT fk_compliance_document
                                        FOREIGN KEY (document_id)
                                            REFERENCES documents(id)
                                            ON DELETE RESTRICT
                                            ON UPDATE CASCADE,

                                    INDEX idx_compliance_bid_id (bid_id),
                                    INDEX idx_compliance_requirement_id (requirement_id)
);


-- =========================================================
-- 9. CROSS VERIFICATION RESULTS
-- Overall cross-verification result for a bid.
-- =========================================================

CREATE TABLE cross_verification_results (
                                            id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                            bid_id BIGINT NOT NULL,

                                            status VARCHAR(30) NOT NULL,
                                            overall_reason TEXT,

                                            checked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                            CONSTRAINT fk_cross_verification_bid
                                                FOREIGN KEY (bid_id)
                                                    REFERENCES bids(id)
                                                    ON DELETE RESTRICT
                                                    ON UPDATE CASCADE,

                                            INDEX idx_cross_verification_bid_id (bid_id)
);


-- =========================================================
-- 10. CROSS VERIFICATION CHECKS
-- Individual comparisons between bidder details/documents.
--
-- source_type / target_type:
-- BIDDER_DETAILS
-- DOCUMENT
--
-- source_reference / target_reference:
-- Example:
-- name
-- legalName
-- address
-- pan
-- gstin
-- =========================================================

CREATE TABLE cross_verification_checks (
                                           id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                           cross_verification_result_id BIGINT NOT NULL,

                                           check_type VARCHAR(50) NOT NULL,

                                           source_type VARCHAR(50) NOT NULL,
                                           source_reference VARCHAR(255) NOT NULL,

                                           target_type VARCHAR(50) NOT NULL,
                                           target_reference VARCHAR(255) NOT NULL,

                                           value_1 TEXT,
                                           value_2 TEXT,

                                           status VARCHAR(30) NOT NULL,
                                           reason TEXT,

                                           CONSTRAINT fk_cross_checks_result
                                               FOREIGN KEY (cross_verification_result_id)
                                                   REFERENCES cross_verification_results(id)
                                                   ON DELETE CASCADE
                                                   ON UPDATE CASCADE,

                                           INDEX idx_cross_checks_result_id
                                               (cross_verification_result_id)
);


-- =========================================================
-- 11. VERIFICATION RESULTS
-- External verification result.
--
-- verification_source can represent:
-- OFFICIAL_API
-- GOVERNMENT_SANDBOX
-- DEVELOPMENT_TEST_SERVICE
-- etc.
--
-- Multiple records preserve verification attempts/history.
-- =========================================================

CREATE TABLE verification_results (
                                      id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                      bid_id BIGINT NOT NULL,
                                      document_id BIGINT NOT NULL,

                                      verification_source VARCHAR(100) NOT NULL,

                                      status VARCHAR(30) NOT NULL,

                                      verified_data JSON,

                                      reason TEXT,

                                      verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                      CONSTRAINT fk_verification_bid
                                          FOREIGN KEY (bid_id)
                                              REFERENCES bids(id)
                                              ON DELETE RESTRICT
                                              ON UPDATE CASCADE,

                                      CONSTRAINT fk_verification_document
                                          FOREIGN KEY (document_id)
                                              REFERENCES documents(id)
                                              ON DELETE RESTRICT
                                              ON UPDATE CASCADE,

                                      INDEX idx_verification_bid_id (bid_id),
                                      INDEX idx_verification_document_id (document_id)
);


-- =========================================================
-- 12. AI SUMMARIES
-- AI-generated officer-facing analysis.
--
-- AI is advisory.
-- It is NOT the final decision-maker.
--
-- Multiple records preserve AI analysis history.
-- =========================================================

CREATE TABLE ai_summaries (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,

                              bid_id BIGINT NOT NULL,

                              summary_text TEXT,

                              key_findings JSON,

                              risk_level VARCHAR(30),

                              recommendation TEXT,

                              generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT fk_ai_summaries_bid
                                  FOREIGN KEY (bid_id)
                                      REFERENCES bids(id)
                                      ON DELETE RESTRICT
                                      ON UPDATE CASCADE,

                              INDEX idx_ai_summaries_bid_id (bid_id)
);


-- =========================================================
-- 13. OFFICER DECISIONS
-- Final human decision.
-- =========================================================

CREATE TABLE officer_decisions (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,

                                   bid_id BIGINT NOT NULL,
                                   officer_id BIGINT NOT NULL,

                                   decision VARCHAR(30) NOT NULL,

                                   remarks TEXT,

                                   decided_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                   CONSTRAINT uq_officer_decision_bid
                                       UNIQUE (bid_id),

                                   CONSTRAINT fk_officer_decisions_bid
                                       FOREIGN KEY (bid_id)
                                           REFERENCES bids(id)
                                           ON DELETE RESTRICT
                                           ON UPDATE CASCADE,

                                   CONSTRAINT fk_officer_decisions_officer
                                       FOREIGN KEY (officer_id)
                                           REFERENCES users(id)
                                           ON DELETE RESTRICT
                                           ON UPDATE CASCADE,

                                   INDEX idx_officer_decisions_bid_id (bid_id)
);


-- =========================================================
-- 14. AUDIT LOGS
-- Tracks important system actions.
-- =========================================================

CREATE TABLE audit_logs (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,

                            user_id BIGINT NOT NULL,

                            action VARCHAR(100) NOT NULL,

                            entity_type VARCHAR(50) NOT NULL,
                            entity_id BIGINT NOT NULL,

                            details JSON,

                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT fk_audit_logs_user
                                FOREIGN KEY (user_id)
                                    REFERENCES users(id)
                                    ON DELETE RESTRICT
                                    ON UPDATE CASCADE,

                            INDEX idx_audit_logs_user_id (user_id),
                            INDEX idx_audit_logs_entity (entity_type, entity_id)
);

ALTER TABLE audit_logs
    MODIFY COLUMN user_id BIGINT NULL;