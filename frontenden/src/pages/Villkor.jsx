import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Villkor = () => {
    let navigate = useNavigate();

    const handleBackToRegistration = () => {
        sessionStorage.setItem('termsAccepted', 'true'); // Save the acceptance state
        navigate('/RegisterPage'); // Navigate back to the registration page
    };
    

  return (
    <div className="flex justify-center font-Lora"> 
        <div className="px-4 py-6 w-2/3 space-y-3 mt-4 bg-white shadow-xl sm:px-10 border-2 rounded-md border-emerald-800 font-medium">
            <p className="text-lg font-semibold">
                Villkor och Bestämmelser för användning av Sollidens bokningsportal.
            </p>
            <p>
                Välkommen till vår bokningsportal för Solliden. Genom att använda denna hemsida godkänner du följande villkor och bestämmelser:
            </p>
            <p>
                1. Ändamål och Användning
                Webbplatsen är avsedd uteslutande för bokning av lantstället som är delägt av släkten. Endast registrerade familjemedlemmar har rätt att använda denna tjänst för att göra bokningar.
            </p>
            <p>
                2. Registrering och Kontoinformation
                För att göra en bokning måste du registrera dig med ditt förnamn, efternamn och e-postadress. Dessa uppgifter kommer att användas för att administrera bokningarna och för att skicka viktig information relaterad till användningen av lantstället.
            </p> 
            <p>
                3. Sekretess och Personuppgifter
                All personlig information som samlas in genom denna webbplats kommer att hanteras med största sekretess och endast användas för syften relaterade till bokning och användning av lantstället. Vi kommer inte att sälja, dela eller på annat sätt distribuera dina personuppgifter till tredje part utan ditt uttryckliga medgivande.
            </p>
            <p>
                4. Bokningsregler
                Bokningar får endast göras av registrerade användare.
                Användare ansvarar för att lämna lantstället i ett städat och fint skick för allas trivsel.
            </p>
            <p>
                5. Ändringar av Villkor
                Vi förbehåller oss rätten att när som helst uppdatera eller ändra dessa villkor. Alla ändringar träder i kraft omedelbart och det är ditt ansvar att regelbundet granska dessa villkor för eventuella ändringar.
            </p>
            <p className="flex justify-between">
                6. Godkännande av Villkor
                Genom att använda denna webbplats och dess tjänster bekräftar du att du har läst, förstått och godkänt dessa villkor.
            <Link to="/RegisterPage" id="terms" name="terms" className="border-2 flex text-center transition-transform hover:scale-110 border-emerald-800 rounded-md" onClick={handleBackToRegistration}>Jag godkänner villkoren</Link>
            </p>
        </div>
        <Outlet/>
    </div>
);
}

export default Villkor;