using Microsoft.AspNetCore.Mvc;
using Rich4Backend.Models;
using Rich4Backend.Services;

namespace Rich4Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameService _gameService;

        public GameController(GameService gameService)
        {
            _gameService = gameService;
        }

        [HttpPost("create")]
        public ActionResult<GameState> CreateGame()
        {
            var game = _gameService.CreateGame();
            return Ok(game);
        }

        [HttpGet("{gameId}")]
        public ActionResult<GameState> GetGame(string gameId)
        {
            var game = _gameService.GetGame(gameId);
            if (game == null) return NotFound();
            return Ok(game);
        }

        [HttpPost("{gameId}/players")]
        public ActionResult<Player> AddPlayer(string gameId, [FromBody] AddPlayerRequest request)
        {
            try
            {
                var player = _gameService.AddPlayer(gameId, request.Name, request.Color);
                return Ok(player);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/start")]
        public ActionResult StartGame(string gameId)
        {
            try
            {
                _gameService.StartGame(gameId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/roll-dice")]
        public ActionResult<DiceRollResult> RollDice(string gameId)
        {
            var (dice1, dice2) = _gameService.RollDice();
            return Ok(new DiceRollResult(dice1, dice2, dice1 + dice2));
        }

        [HttpPost("{gameId}/move")]
        public ActionResult MovePlayer(string gameId, [FromBody] MovePlayerRequest request)
        {
            try
            {
                _gameService.MovePlayer(gameId, request.PlayerId, request.Steps);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/buy-property")]
        public ActionResult BuyProperty(string gameId, [FromBody] BuyPropertyRequest request)
        {
            try
            {
                _gameService.BuyProperty(gameId, request.PlayerId, request.PropertyId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/upgrade-property")]
        public ActionResult UpgradeProperty(string gameId, [FromBody] UpgradePropertyRequest request)
        {
            try
            {
                _gameService.UpgradeProperty(gameId, request.PlayerId, request.PropertyId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/pay-rent")]
        public ActionResult PayRent(string gameId, [FromBody] PayRentRequest request)
        {
            try
            {
                _gameService.PayRent(gameId, request.PayerId, request.ReceiverId, request.Amount);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/next-turn")]
        public ActionResult NextTurn(string gameId)
        {
            try
            {
                _gameService.NextTurn(gameId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/draw-chance")]
        public ActionResult<Card> DrawChanceCard(string gameId)
        {
            try
            {
                var card = _gameService.DrawChanceCard(gameId);
                return Ok(card);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/draw-destiny")]
        public ActionResult<Card> DrawDestinyCard(string gameId)
        {
            try
            {
                var card = _gameService.DrawDestinyCard(gameId);
                return Ok(card);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/apply-card")]
        public ActionResult ApplyCard(string gameId, [FromBody] ApplyCardRequest request)
        {
            try
            {
                _gameService.ApplyCard(gameId, request.PlayerId, request.Card);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

    public record AddPlayerRequest(string Name, string Color);
    public record MovePlayerRequest(string PlayerId, int Steps);
    public record BuyPropertyRequest(string PlayerId, int PropertyId);
    public record UpgradePropertyRequest(string PlayerId, int PropertyId);
    public record PayRentRequest(string PayerId, string ReceiverId, int Amount);
    public record DiceRollResult(int Dice1, int Dice2, int Total);
    public record ApplyCardRequest(string PlayerId, Card Card);
}
