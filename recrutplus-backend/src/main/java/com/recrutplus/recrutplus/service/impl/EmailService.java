package com.recrutplus.recrutplus.service.impl;

import com.recrutplus.recrutplus.model.enums.ApplicationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.base-url}")
    private String baseUrl;

    public void sendApplicationConfirmation(String candidatEmail, String candidatName, String offerTitle) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(candidatEmail);
            helper.setSubject("Confirmation de candidature - " + offerTitle);

            String content = String.format(
                    "Bonjour %s,\n\n" +
                            "Votre candidature pour le poste \"%s\" a bien été reçue.\n" +
                            "Nous reviendrons vers vous prochainement.\n\n" +
                            "Cordialement,\nL'équipe RecrutePlus",
                    candidatName, offerTitle
            );

            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email confirmation candidature envoyé à : " + candidatEmail);
        } catch (Exception e) {
            System.err.println("Erreur envoi email confirmation candidature: " + e.getMessage());
        }
    }

    public void sendStatusChange(String candidatEmail, String candidatName, String offerTitle, ApplicationStatus newStatus, String comment) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(candidatEmail);

            String subject = "";
            String content = "";

            switch (newStatus) {
                case EMBAUCHE:
                    subject = "Félicitations ! Votre candidature a été retenue - " + offerTitle;
                    content = String.format(
                            "Bonjour %s,\n\n" +
                                    "Excellente nouvelle ! Nous avons le plaisir de vous annoncer que votre candidature pour le poste \"%s\" a été retenue.\n\n" +
                                    "Félicitations ! Nous vous contacterons prochainement pour finaliser votre intégration.\n\n" +
                                    "%s\n\n" +
                                    "Cordialement,\nL'équipe RecrutePlus",
                            candidatName, offerTitle, comment != null ? "Message : " + comment : ""
                    );
                    break;

                case REFUSE:
                case REFUSE_APRES_ENTRETIEN:
                    subject = "Suite donnée à votre candidature - " + offerTitle;
                    content = String.format(
                            "Bonjour %s,\n\n" +
                                    "Nous vous remercions pour votre candidature au poste \"%s\".\n" +
                                    "Après étude de votre profil, nous ne pouvons malheureusement pas donner suite à votre candidature.\n\n" +
                                    "Nous vous encourageons à postuler à nos futures offres qui pourraient mieux correspondre à votre profil.\n\n" +
                                    "%s\n\n" +
                                    "Cordialement,\nL'équipe RecrutePlus",
                            candidatName, offerTitle, comment != null ? "Commentaire : " + comment : ""
                    );
                    break;

                case ENTRETIEN_TERMINE:
                    subject = "Entretien effectué - " + offerTitle;
                    content = String.format(
                            "Bonjour %s,\n\n" +
                                    "Merci d'avoir participé à l'entretien pour le poste \"%s\".\n" +
                                    "Nous reviendrons vers vous prochainement avec notre décision.\n\n" +
                                    "%s\n\n" +
                                    "Cordialement,\nL'équipe RecrutePlus",
                            candidatName, offerTitle, comment != null ? "Commentaire : " + comment : ""
                    );
                    break;

                case EN_COURS:
                    subject = "Votre candidature est en cours d'étude - " + offerTitle;
                    content = String.format(
                            "Bonjour %s,\n\n" +
                                    "Votre candidature pour le poste \"%s\" est actuellement en cours d'étude par nos équipes.\n" +
                                    "Nous reviendrons vers vous prochainement.\n\n" +
                                    "%s\n\n" +
                                    "Cordialement,\nL'équipe RecrutePlus",
                            candidatName, offerTitle, comment != null ? "Information : " + comment : ""
                    );
                    break;


            }

            helper.setSubject(subject);
            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email changement statut envoyé à : " + candidatEmail + " - Statut : " + newStatus);
        } catch (Exception e) {
            System.err.println("Erreur envoi email changement statut: " + e.getMessage());
        }
    }

    public void sendInterviewInvitation(String candidatEmail, String candidatName, String offerTitle, String interviewDate, String interviewType, String visioLink, String notes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(candidatEmail);
            helper.setSubject("Invitation entretien - " + offerTitle);

            String content = String.format(
                    "Bonjour %s,\n\n" +
                            "Vous êtes convoqué(e) à un entretien pour le poste \"%s\".\n\n" +
                            "Détails de l'entretien :\n" +
                            "- Date et heure : %s\n" +
                            "- Type : %s\n" +
                            "%s\n" +
                            "%s\n\n" +
                            "Nous vous remercions pour votre intérêt et avons hâte de vous rencontrer.\n\n" +
                            "Cordialement,\nL'équipe RecrutePlus",
                    candidatName, offerTitle, interviewDate, interviewType,
                    visioLink != null && !visioLink.isEmpty() ? "- Lien visioconférence : " + visioLink : "- Entretien en présentiel",
                    notes != null && !notes.isEmpty() ? "\nNotes supplémentaires :\n" + notes : ""
            );

            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email invitation entretien envoyé à : " + candidatEmail);
        } catch (Exception e) {
            System.err.println("Erreur envoi email invitation entretien: " + e.getMessage());
        }
    }

    public void sendNewApplicationNotification(String rhEmail, String candidatName, String offerTitle, Long applicationId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(rhEmail);
            helper.setSubject("Nouvelle candidature reçue - " + offerTitle);

            String content = String.format(
                    "Bonjour,\n\n" +
                            "Une nouvelle candidature a été reçue :\n" +
                            "- Candidat : %s\n" +
                            "- Poste : %s\n\n" +
                            "Vous pouvez consulter la candidature sur : %s/applications/%d\n\n" +
                            "Cordialement,\nRecrutePlus",
                    candidatName, offerTitle, baseUrl, applicationId
            );

            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email notification nouvelle candidature envoyé à : " + rhEmail);
        } catch (Exception e) {
            System.err.println("Erreur envoi email notification RH: " + e.getMessage());
        }
    }

    public void sendAccessCode(String userEmail, String userName, String accessCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(userEmail);
            helper.setSubject("Votre code d'accès RecrutePlus");

            String content = String.format(
                    "Bonjour %s,\n\n" +
                            "Votre compte RecrutePlus a été créé.\n" +
                            "Votre code d'accès temporaire est : %s\n\n" +
                            "Connectez-vous sur %s avec ce code.\n" +
                            "Vous devrez définir un nouveau mot de passe lors de votre première connexion.\n\n" +
                            "Ce code expire dans 30 jours.\n\n" +
                            "Cordialement,\nL'équipe RecrutePlus",
                    userName, accessCode, baseUrl
            );

            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email code d'accès envoyé à : " + userEmail + " - Code : " + accessCode);
        } catch (Exception e) {
            System.err.println("Erreur envoi email code d'accès: " + e.getMessage());
        }
    }

    public void sendInterviewCancellation(String candidatEmail, String candidatName, String offerTitle, String interviewDate, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(candidatEmail);
            helper.setSubject("Annulation entretien - " + offerTitle);

            String content = String.format(
                    "Bonjour %s,\n\n" +
                            "Nous devons malheureusement annuler votre entretien du %s pour le poste \"%s\".\n\n" +
                            "%s\n\n" +
                            "Nous vous recontacterons prochainement pour reprogrammer.\n\n" +
                            "Cordialement,\nL'équipe RecrutePlus",
                    candidatName, interviewDate, offerTitle, reason != null ? reason : "Nous nous excusons pour ce contretemps."
            );

            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email annulation entretien envoyé à : " + candidatEmail);
        } catch (Exception e) {
            System.err.println("Erreur envoi email annulation entretien: " + e.getMessage());
        }
    }

    public void sendTestEmail(String toEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Test email RecrutePlus");

            String content = "Ceci est un email de test pour vérifier la configuration de RecrutePlus.\n\n" +
                    "Si vous recevez ce message, la configuration email fonctionne correctement.\n\n" +
                    "Cordialement,\nL'équipe RecrutePlus";

            helper.setText(content);
            mailSender.send(message);

            System.out.println("Email de test envoyé à : " + toEmail);
        } catch (Exception e) {
            System.err.println("Erreur envoi email de test: " + e.getMessage());
        }
    }
}