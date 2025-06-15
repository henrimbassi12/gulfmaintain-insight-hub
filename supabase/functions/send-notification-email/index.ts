
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@3.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewUserPayload {
  new_user_name: string;
  new_user_email: string;
  new_user_role: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { new_user_name, new_user_email, new_user_role }: NewUserPayload = await req.json();

    if (!new_user_name || !new_user_email || !new_user_role) {
      return new Response(JSON.stringify({ error: "Données utilisateur manquantes" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: admins, error: adminError } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('role', 'admin')
      .eq('account_status', 'approved');

    if (adminError) {
      throw new Error(`Erreur Supabase: ${adminError.message}`);
    }

    if (!admins || admins.length === 0) {
      console.warn("Aucun administrateur trouvé à notifier.");
      return new Response(JSON.stringify({ message: "Aucun administrateur à notifier." }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const adminEmails = admins.map(admin => admin.email);

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const subject = `Nouvelle inscription en attente : ${new_user_name}`;
    const html = `
      <h1>Nouvelle Inscription sur Gulf Maintain</h1>
      <p>Un nouvel utilisateur s'est inscrit et attend votre approbation.</p>
      <ul>
        <li><strong>Nom :</strong> ${new_user_name || 'Non fourni'}</li>
        <li><strong>Email :</strong> ${new_user_email}</li>
        <li><strong>Rôle demandé :</strong> ${new_user_role}</li>
      </ul>
      <p>
        Veuillez vous connecter à l'application et vous rendre sur la page de <strong>Gestion des Utilisateurs</strong> pour examiner cette demande.
      </p>
      <br>
      <p>Merci,</p>
      <p>L'équipe Gulf Maintain</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "Gulf Maintain Notif <onboarding@resend.dev>",
      to: adminEmails,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Erreur API Resend:", error);
      throw new Error(error.message);
    }

    return new Response(JSON.stringify({ message: "Notifications envoyées avec succès.", details: data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Erreur dans la fonction send-notification-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
